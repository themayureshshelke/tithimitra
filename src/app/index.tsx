
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const events = [
  { name: 'एकादशी', subtitle: 'Ekadashi', date: 'Upcoming event', icon: '◐' },
  { name: 'संकष्टी चतुर्थी', subtitle: 'Sankashti Chaturthi', date: 'Upcoming event', icon: '☾' },
  { name: 'पौर्णिमा', subtitle: 'Purnima', date: 'Upcoming event', icon: '○' },
  { name: 'अमावस्या', subtitle: 'Amavasya', date: 'Upcoming event', icon: '●' },
];

export default function HomeScreen() {
  const cities = [
    'Mumbai',
    'Pune',
    'Nashik',
    'Nagpur',
    'Kolhapur',
    'Thane',
    'Chhatrapati Sambhajinagar',
  ];

  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [showCityPicker, setShowCityPicker] = useState(false);

  return (

<ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>तिथीमित्र</Text>
          <Text style={styles.tagline}>Your Vrat & Panchang Companion</Text>
        </View>
        <Pressable
      style={styles.location}
  onPress={() => setShowCityPicker(!showCityPicker)}
>
      <Text style={styles.locationText}>
    {selectedCity} ⌄
  </Text>
</Pressable>
      </View>

      {showCityPicker && (
        <View style={styles.cityMenu}>
          {cities.map((city) => (
            <Pressable
              key={city}
              style={styles.cityOption}
              onPress={() => {
                setSelectedCity(city);
                setShowCityPicker(false);
              }}
            >
              <Text
                style={[
                  styles.cityOptionText,
                  selectedCity === city && styles.cityOptionSelected,
                ]}
              >
                {city}
                {selectedCity === city ? '  ✓' : ''}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.greeting}>
        <Text style={styles.eyebrow}>TODAY'S PANCHANG</Text>
        <Text style={styles.heading}>Your observances,{"\n"}all in one place.</Text>
        <Text style={styles.muted}>
          Timings and dates will appear here once the Panchang data source is connected.
        </Text>
      </View>

      <View style={styles.nextCard}>
        <Text style={styles.eyebrow}>YOUR NEXT OBSERVANCE</Text>
        <Text style={styles.eventTitle}>संकष्टी चतुर्थी</Text>
        <Text style={styles.subtitle}>Sankashti Chaturthi</Text>
        <View style={styles.divider} />

        <View style={styles.timingRow}>
          <View style={styles.timingBox}>
            <Text style={styles.timingLabel}>MOONRISE</Text>
            <Text style={styles.timingValue}>--:--</Text>
            <Text style={styles.timingNote}>Awaiting verified data</Text>
          </View>
          <View style={styles.timingBox}>
            <Text style={styles.timingLabel}>TITHI ENDS</Text>
            <Text style={styles.timingValue}>--:--</Text>
            <Text style={styles.timingNote}>Awaiting verified data</Text>
          </View>
        </View>

        <View style={styles.reminder}>
          <Text style={styles.reminderTitle}>♧  Ritual reminders</Text>
          <Text style={styles.reminderText}>
            Set reminders for moonrise, tithi boundaries and applicable Parana times.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming observances</Text>
        <Text style={styles.sectionCaption}>UP NEXT</Text>
      </View>

      {events.map((event) => (
        <View key={event.name} style={styles.eventRow}>
          <View style={styles.eventIcon}>
            <Text style={styles.iconText}>{event.icon}</Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.subtitle}>{event.subtitle}</Text>
          </View>
          <Text style={styles.eventDate}>{event.date}</Text>
        </View>
      ))}

      <Text style={styles.footer}>
        TITHIMITRA · Panchang timings will be verified before display.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6F4EF' },
  content: { padding: 22, paddingTop: 28, paddingBottom: 48, maxWidth: 760, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  brand: { fontSize: 27, fontWeight: '800', color: '#253C32' },
  tagline: { fontSize: 12, color: '#777A70', marginTop: 3 },
  location: {
    backgroundColor: '#E7E9DF',
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 12,
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
  greeting: { marginBottom: 22 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.8, color: '#A16D37', marginBottom: 12 },
  heading: { fontSize: 32, lineHeight: 39, fontWeight: '800', color: '#253C32', marginBottom: 10 },
  muted: { fontSize: 14, lineHeight: 21, color: '#777A70' },
  nextCard: { backgroundColor: '#253C32', padding: 22, borderRadius: 24, marginBottom: 30 },
  eventTitle: { color: '#FFFFFF', fontSize: 27, fontWeight: '800', marginTop: 5 },
  subtitle: { color: '#898C83', fontSize: 12, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#43564A', marginVertical: 20 },
  timingRow: { flexDirection: 'row', gap: 12 },
  timingBox: { flex: 1, backgroundColor: '#30483B', borderRadius: 15, padding: 14 },
  timingLabel: { color: '#C8D0C2', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  timingValue: { color: '#FFFFFF', fontSize: 25, fontWeight: '700', marginTop: 10 },
  timingNote: { color: '#C8D0C2', fontSize: 10, marginTop: 5 },
  reminder: { backgroundColor: '#3A5143', padding: 15, borderRadius: 14, marginTop: 18 },
  reminderTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  reminderText: { color: '#D8DFD5', fontSize: 12, lineHeight: 18, marginTop: 7 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#253C32' },
  sectionCaption: { color: '#A16D37', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  eventRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 17, padding: 14, marginBottom: 10 },
  eventIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: '#F0EEE5', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 22, color: '#A16D37' },
  eventInfo: { flex: 1, marginLeft: 13 },
  eventName: { color: '#253C32', fontSize: 15, fontWeight: '700' },
  eventDate: { color: '#898C83', fontSize: 10, textAlign: 'right', maxWidth: 90 },
  footer: { textAlign: 'center', color: '#898C83', fontSize: 10, marginTop: 25, lineHeight: 16 },
});
