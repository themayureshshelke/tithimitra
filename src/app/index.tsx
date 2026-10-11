
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

type ObservanceType = {
  id: string;
  name_en: string;
  name_mr: string;
  description_en: string | null;
};

type City = {
  slug: string;
  name: string;
};

const eventIcons: Record<string, string> = {
  PURNIMA: '○',
  AMAVASYA: '●',
  EKADASHI: '◐',
  SANKASHTI_CHATURTHI: '☾',
  ANGARKI_SANKASHTI: '◔',
};

export default function HomeScreen() {
  const [events, setEvents] = useState<ObservanceType[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState('mumbai');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [eventResult, cityResult] = await Promise.all([
          supabase
            .from('observance_types')
            .select('id, name_en, name_mr, description_en')
            .eq('is_active', true)
            .order('name_en'),

          supabase
            .from('locations')
            .select('slug, name')
            .eq('is_active', true)
            .order('name'),
        ]);

        if (!active) return;

        const errors = [];

        if (eventResult.error) {
          errors.push(`Observances: ${eventResult.error.message}`);
        }

        if (cityResult.error) {
          errors.push(`Cities: ${cityResult.error.message}`);
        }

        if (errors.length > 0) {
          setError(errors.join('\n'));
          return;
        }

        setEvents(eventResult.data ?? []);
        setCities(cityResult.data ?? []);
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected database error occurred.'
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  const currentCity =
    cities.find((city) => city.slug === selectedCity)?.name ??
    'Select city';

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>तिथीमित्र</Text>
          <Text style={styles.tagline}>
            Your Vrat & Panchang Companion
          </Text>
        </View>

        <Pressable
          style={styles.location}
          onPress={() => setShowCityPicker((visible) => !visible)}
          accessibilityRole="button"
          accessibilityLabel={`Selected city: ${currentCity}`}
        >
          <Text style={styles.locationText}>
            {currentCity} ⌄
          </Text>
        </Pressable>
      </View>

      {showCityPicker && (
        <View style={styles.cityMenu}>
          {loading ? (
            <ActivityIndicator color="#253C32" />
          ) : cities.length === 0 ? (
            <Text style={styles.cityOptionText}>
              No cities available.
            </Text>
          ) : (
            cities.map((city) => (
              <Pressable
                key={city.slug}
                style={styles.cityOption}
                onPress={() => {
                  setSelectedCity(city.slug);
                  setShowCityPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.cityOptionText,
                    selectedCity === city.slug &&
                      styles.cityOptionSelected,
                  ]}
                >
                  {city.name}
                  {selectedCity === city.slug ? '  ✓' : ''}
                </Text>
              </Pressable>
            ))
          )}
        </View>
      )}

      <View style={styles.greeting}>
        <Text style={styles.eyebrow}>TODAY'S PANCHANG</Text>
        <Text style={styles.heading}>
          Your observances,{"\n"}all in one place.
        </Text>
        <Text style={styles.muted}>
          Discover important observances and the timings that matter
          for your rituals.
        </Text>
      </View>

      <View style={styles.nextCard}>
        <Text style={styles.eyebrow}>PANCHANG DATA STATUS</Text>
        <Text style={styles.eventTitle}>पंचांग माहिती</Text>
        <Text style={styles.cardSubtitle}>
          Verified observance timings are not connected yet.
        </Text>

        <View style={styles.divider} />

        <View style={styles.timingRow}>
          <View style={styles.timingBox}>
            <Text style={styles.timingLabel}>MOONRISE</Text>
            <Text style={styles.timingValue}>--:--</Text>
            <Text style={styles.timingNote}>
              Awaiting verified data
            </Text>
          </View>

          <View style={styles.timingBox}>
            <Text style={styles.timingLabel}>TITHI ENDS</Text>
            <Text style={styles.timingValue}>--:--</Text>
            <Text style={styles.timingNote}>
              Awaiting verified data
            </Text>
          </View>
        </View>

        <View style={styles.reminder}>
          <Text style={styles.reminderTitle}>
            Ritual reminders
          </Text>
          <Text style={styles.reminderText}>
            Reminders for moonrise, tithi boundaries and applicable
            Parana times will be added after timing validation.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Observances tracked
        </Text>
        <Text style={styles.sectionCaption}>
          FROM DATABASE
        </Text>
      </View>

      {loading ? (
        <View style={styles.statusBox}>
          <ActivityIndicator color="#253C32" />
          <Text style={styles.statusText}>
            Loading observances and cities...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>
            Could not load database data
          </Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>
            No active observances found.
          </Text>
        </View>
      ) : (
        events.map((event) => (
          <View key={event.id} style={styles.eventRow}>
            <View style={styles.eventIcon}>
              <Text style={styles.iconText}>
                {eventIcons[event.id] ?? '◐'}
              </Text>
            </View>

            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>
                {event.name_mr}
              </Text>
              <Text style={styles.subtitle}>
                {event.name_en}
              </Text>
              {event.description_en ? (
                <Text style={styles.description}>
                  {event.description_en}
                </Text>
              ) : null}
            </View>
          </View>
        ))
      )}

      <Text style={styles.footer}>
        TITHIMITRA · Verified local timings will be displayed when
        available.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F6F4EF',
  },
  content: {
    padding: 22,
    paddingTop: 28,
    paddingBottom: 48,
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    gap: 12,
  },
  brand: {
    fontSize: 27,
    fontWeight: '800',
    color: '#253C32',
  },
  tagline: {
    fontSize: 12,
    color: '#777A70',
    marginTop: 3,
  },
  location: {
    backgroundColor: '#E7E9DF',
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 12,
    maxWidth: '55%',
  },
  locationText: {
    color: '#253C32',
    fontSize: 13,
  },
  cityMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E7E9DF',
  },
  cityOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 9,
  },
  cityOptionText: {
    color: '#253C32',
    fontSize: 14,
  },
  cityOptionSelected: {
    fontWeight: '700',
    color: '#A16D37',
  },
  greeting: {
    marginBottom: 22,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: '#A16D37',
    marginBottom: 12,
  },
  heading: {
    fontSize: 32,
    lineHeight: 39,
    fontWeight: '800',
    color: '#253C32',
    marginBottom: 10,
  },
  muted: {
    fontSize: 14,
    lineHeight: 21,
    color: '#777A70',
  },
  nextCard: {
    backgroundColor: '#253C32',
    padding: 22,
    borderRadius: 24,
    marginBottom: 30,
  },
  eventTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    marginTop: 5,
  },
  cardSubtitle: {
    color: '#D8DFD5',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#43564A',
    marginVertical: 20,
  },
  timingRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timingBox: {
    flex: 1,
    backgroundColor: '#30483B',
    borderRadius: 15,
    padding: 14,
  },
  timingLabel: {
    color: '#C8D0C2',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  timingValue: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '700',
    marginTop: 10,
  },
  timingNote: {
    color: '#C8D0C2',
    fontSize: 10,
    marginTop: 5,
  },
  reminder: {
    backgroundColor: '#3A5143',
    padding: 15,
    borderRadius: 14,
    marginTop: 18,
  },
  reminderTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  reminderText: {
    color: '#D8DFD5',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#253C32',
  },
  sectionCaption: {
    color: '#A16D37',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 14,
    marginBottom: 10,
  },
  eventIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#F0EEE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
    color: '#A16D37',
  },
  eventInfo: {
    flex: 1,
    marginLeft: 13,
  },
  eventName: {
    color: '#253C32',
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    color: '#898C83',
    fontSize: 12,
    marginTop: 4,
  },
  description: {
    color: '#777A70',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  statusBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  statusText: {
    color: '#777A70',
    fontSize: 13,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FCE8E6',
    borderRadius: 15,
    padding: 16,
  },
  errorTitle: {
    color: '#9F2D26',
    fontWeight: '700',
    marginBottom: 7,
  },
  errorText: {
    color: '#7C2924',
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    textAlign: 'center',
    color: '#898C83',
    fontSize: 10,
    marginTop: 25,
    lineHeight: 16,
  },
});
