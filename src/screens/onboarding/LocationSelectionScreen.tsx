import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { theme } from '../../theme/theme';

// ZIP → State ranges (USPS primary ranges, offline and lightweight)
type ZipRange = { start: number; end: number; state: string };
const ZIP_STATE_RANGES: ZipRange[] = [
  { start: 35000, end: 36999, state: 'Alabama' },
  { start: 99500, end: 99999, state: 'Alaska' },
  { start: 85000, end: 86999, state: 'Arizona' },
  { start: 71600, end: 72999, state: 'Arkansas' },
  { start: 90000, end: 96699, state: 'California' },
  { start: 80000, end: 81699, state: 'Colorado' },
  { start: 6000, end: 6999, state: 'Connecticut' },
  { start: 19700, end: 19999, state: 'Delaware' },
  { start: 32000, end: 34999, state: 'Florida' },
  { start: 30000, end: 31999, state: 'Georgia' },
  { start: 96700, end: 96899, state: 'Hawaii' },
  { start: 83200, end: 83999, state: 'Idaho' },
  { start: 60000, end: 62999, state: 'Illinois' },
  { start: 46000, end: 47999, state: 'Indiana' },
  { start: 50000, end: 52999, state: 'Iowa' },
  { start: 66000, end: 67999, state: 'Kansas' },
  { start: 40000, end: 42999, state: 'Kentucky' },
  { start: 70000, end: 71599, state: 'Louisiana' },
  { start: 3900, end: 4999, state: 'Maine' },
  { start: 20600, end: 21999, state: 'Maryland' },
  { start: 1000, end: 2799, state: 'Massachusetts' },
  { start: 48000, end: 49999, state: 'Michigan' },
  { start: 55000, end: 56999, state: 'Minnesota' },
  { start: 38600, end: 39999, state: 'Mississippi' },
  { start: 63000, end: 65999, state: 'Missouri' },
  { start: 59000, end: 59999, state: 'Montana' },
  { start: 68000, end: 69999, state: 'Nebraska' },
  { start: 88900, end: 89999, state: 'Nevada' },
  { start: 3000, end: 3899, state: 'New Hampshire' },
  { start: 7000, end: 8999, state: 'New Jersey' },
  { start: 87000, end: 88499, state: 'New Mexico' },
  { start: 10000, end: 14999, state: 'New York' },
  { start: 27000, end: 28999, state: 'North Carolina' },
  { start: 58000, end: 58999, state: 'North Dakota' },
  { start: 43000, end: 45999, state: 'Ohio' },
  { start: 73000, end: 74999, state: 'Oklahoma' },
  { start: 97000, end: 97999, state: 'Oregon' },
  { start: 15000, end: 19699, state: 'Pennsylvania' },
  { start: 2800, end: 2999, state: 'Rhode Island' },
  { start: 29000, end: 29999, state: 'South Carolina' },
  { start: 57000, end: 57999, state: 'South Dakota' },
  { start: 37000, end: 38599, state: 'Tennessee' },
  { start: 75000, end: 79999, state: 'Texas' },
  { start: 88500, end: 88599, state: 'Texas' }, // El Paso
  { start: 84000, end: 84999, state: 'Utah' },
  { start: 5000, end: 5999, state: 'Vermont' },
  { start: 20100, end: 20599, state: 'District of Columbia' },
  { start: 22000, end: 24699, state: 'Virginia' },
  { start: 98000, end: 99499, state: 'Washington' },
  { start: 24700, end: 26999, state: 'West Virginia' },
  { start: 53000, end: 54999, state: 'Wisconsin' },
  { start: 82000, end: 83199, state: 'Wyoming' },
];

const STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  'District of Columbia': 'DC',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
};

const STATE_FUN_FACTS: Record<string, string[]> = {
  Alabama: [
    'Sweet Home Alabama became the official state song in 1980.',
    'The first electric streetcar system in the world opened in Montgomery.',
  ],
  Alaska: [
    'Alaska has more coastline than the rest of the U.S. combined.',
    'Barrow (Utqiagvik) sees 65 days of continuous night in winter.',
  ],
  Arizona: [
    'The Grand Canyon is bigger than the state of Rhode Island.',
    'Arizona produces more copper than any other U.S. state.',
  ],
  Arkansas: [
    'Arkansas is the only state where diamonds are mined by the public.',
    'It is known as the Natural State for its hot springs and forests.',
  ],
  California: [
    'California grows over 80% of U.S. wine grapes.',
    'The first McDonald’s opened in San Bernardino in 1940.',
  ],
  Colorado: [
    'Denver is the Mile High City at exactly 5,280 feet elevation.',
    'Colorado has 58 mountain peaks over 14,000 feet (14ers).',
  ],
  Connecticut: [
    'The first American phone book (1878) listed only 50 subscribers.',
    'Hamburgers are claimed to be invented in New Haven in 1900.',
  ],
  Delaware: [
    'Delaware was the first state to ratify the U.S. Constitution.',
    'The state has no sales tax.',
  ],
  Florida: [
    'Florida has the longest coastline in the continental U.S.',
    'Key West is the southernmost point of the continental states.',
  ],
  Georgia: [
    'Georgia is the nation’s top producer of peanuts.',
    'Coca-Cola was invented in Atlanta in 1886.',
  ],
  Hawaii: [
    'Hawaii is the most isolated population center on earth.',
    'Mauna Kea is taller than Everest when measured from seafloor.',
  ],
  Idaho: [
    'Idaho produces about one-third of America’s potatoes.',
    'The state seal was designed by a woman—unique among U.S. states.',
  ],
  Illinois: [
    'The world’s first skyscraper was built in Chicago in 1885.',
    'Route 66 starts in Chicago.',
  ],
  Indiana: [
    'Indianapolis 500 is the world’s largest single-day sporting event.',
    'Santa Claus, Indiana receives thousands of letters to Santa yearly.',
  ],
  Iowa: [
    'Iowa has more hogs than people.',
    'The first electronic digital computer was built at Iowa State (ABC).',
  ],
  Kansas: [
    'Dodge City was once known as the “Wickedest Little City in America.”',
    'Kansas is the geographic center of the contiguous United States.',
  ],
  Kentucky: [
    'Kentucky is the world’s bourbon capital—over 90% is made here.',
    'The Kentucky Derby is the oldest continuously held horse race in the U.S.',
  ],
  Louisiana: [
    'Jazz was born in New Orleans.',
    'Louisiana is the only state with parishes instead of counties.',
  ],
  Maine: [
    'Maine produces 90% of the U.S. lobster supply.',
    'It is the easternmost state, seeing sunrise first in the contiguous U.S.',
  ],
  Maryland: [
    'The U.S. Naval Academy is in Annapolis.',
    'Old Bay seasoning was created in Baltimore in 1939.',
  ],
  Massachusetts: [
    'The first American lighthouse was built in Boston Harbor in 1716.',
    'Basketball was invented in Springfield in 1891.',
  ],
  Michigan: [
    'Michigan has the longest freshwater coastline in the world.',
    'Detroit gave the world Motown and the modern auto industry.',
  ],
  Minnesota: [
    'Minnesota is the Land of 10,000 Lakes—actually over 11,000.',
    'The Mall of America could fit seven Yankee Stadiums inside.',
  ],
  Mississippi: [
    'The Mississippi River is the second-longest in North America.',
    'Blues music traces roots to the Mississippi Delta.',
  ],
  Missouri: [
    'The Gateway Arch in St. Louis is the tallest monument in the U.S.',
    'Kansas City is famed for its barbecue and jazz heritage.',
  ],
  Montana: [
    'Montana has more cattle than people.',
    'Glacier National Park has over 700 miles of trails.',
  ],
  Nebraska: [
    'Nebraska’s Chimney Rock was a landmark on the Oregon Trail.',
    'The Reuben sandwich was created in Omaha, according to locals.',
  ],
  Nevada: [
    'Nevada is the driest state in the U.S.',
    'Area 51, the famed secret base, is in southern Nevada.',
  ],
  'New Hampshire': [
    'New Hampshire held the first U.S. presidential primary.',
    'Mount Washington once recorded 231 mph winds, a world record.',
  ],
  'New Jersey': [
    'The first boardwalk was built in Atlantic City in 1870.',
    'Thomas Edison’s lab in Menlo Park produced over 400 patents.',
  ],
  'New Mexico': [
    'New Mexico’s license plates say “Land of Enchantment.”',
    'The first atomic test (Trinity) took place near Alamogordo.',
  ],
  'New York': [
    'Times Square was once named Longacre Square.',
    'The Adirondack Park is larger than Yellowstone, Everglades, Glacier, and Grand Canyon combined.',
  ],
  'North Carolina': [
    'The Wright brothers flew the first powered airplane at Kitty Hawk.',
    'Krispy Kreme was founded in Winston-Salem in 1937.',
  ],
  'North Dakota': [
    'North Dakota leads the U.S. in honey production.',
    'The International Peace Garden spans North Dakota and Manitoba.',
  ],
  Ohio: [
    'Ohio is the birthplace of seven U.S. presidents.',
    'Cleveland’s Rock & Roll Hall of Fame honors the genre’s roots.',
  ],
  Oklahoma: [
    'The National Cowboy & Western Heritage Museum is in Oklahoma City.',
    'Oklahoma has more man-made lakes than any other state.',
  ],
  Oregon: [
    'Portland has more breweries than any city in the world.',
    'Crater Lake is the deepest lake in the United States.',
  ],
  Pennsylvania: [
    'The Declaration of Independence was signed in Philadelphia.',
    'Hershey, PA is known as the Chocolate Capital of the U.S.',
  ],
  'Rhode Island': [
    'Rhode Island is the smallest U.S. state by area.',
    'Newport was America’s “summer White House” for several presidents.',
  ],
  'South Carolina': [
    'Sweet tea is said to have been popularized here.',
    'Charleston’s Rainbow Row is one of the most photographed spots in the South.',
  ],
  'South Dakota': [
    'Mount Rushmore features four U.S. presidents carved in granite.',
    'The Black Hills have the world’s largest mountain carving, Crazy Horse.',
  ],
  Tennessee: [
    'Nashville is known as Music City for its country music heritage.',
    'Graceland in Memphis is Elvis Presley’s famous home.',
  ],
  Texas: [
    'Texas was an independent republic from 1836 to 1845.',
    'Dr Pepper was created in Waco in 1885.',
  ],
  Utah: [
    'Utah’s “Mighty Five” national parks draw millions each year.',
    'The Great Salt Lake is saltier than the ocean.',
  ],
  Vermont: [
    'Vermont has more covered bridges per square mile than any other state.',
    'Ben & Jerry’s was founded in Burlington in 1978.',
  ],
  'District of Columbia': [
    'The Library of Congress is the largest library in the world.',
    'Cherry blossoms were a gift from Japan in 1912.',
  ],
  Virginia: [
    'Eight U.S. presidents were born in Virginia.',
    'Colonial Williamsburg is the largest living history museum in the U.S.',
  ],
  Washington: [
    'Seattle has more dogs than children living in the city.',
    'Mount Rainier is an active volcano towering 14,410 feet.',
  ],
  'West Virginia': [
    'The New River Gorge Bridge is one of the longest single-span bridges in the world.',
    'West Virginia became a state during the Civil War in 1863.',
  ],
  Wisconsin: [
    'Wisconsin produces more cheese than any other state.',
    'The typewriter was invented in Milwaukee in 1867.',
  ],
  Wyoming: [
    'Yellowstone, the first national park, is mostly in Wyoming.',
    'Wyoming was the first state to grant women the right to vote (1869).',
  ],
};

const detectStateByZip = (zip: string): string | null => {
  if (!/^[0-9]{5}$/.test(zip)) return null;
  const zipNum = Number(zip);
  const match = ZIP_STATE_RANGES.find(
    (range) => zipNum >= range.start && zipNum <= range.end,
  );
  return match ? match.state : null;
};

interface LocationSelectionScreenProps {
  onLocationSelected: (state: string) => void;
  onBack: () => void;
}

export const LocationSelectionScreen: React.FC<LocationSelectionScreenProps> = ({
  onLocationSelected,
  onBack,
}) => {
  const [zip, setZip] = useState('');
  const [detectedState, setDetectedState] = useState<string | null>(null);
  const [funFact, setFunFact] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (detectedState) {
      onLocationSelected(detectedState);
    }
  };

  const handleZipChange = (value: string) => {
    const sanitized = value.replace(/[^0-9]/g, '').slice(0, 5);
    setZip(sanitized);

    if (sanitized.length === 5) {
      const state = detectStateByZip(sanitized);
      setDetectedState(state);
      if (state) {
        const facts = STATE_FUN_FACTS[state];
        if (facts && facts.length) {
          const randomFact = facts[Math.floor(Math.random() * facts.length)];
          setFunFact(randomFact);
        } else {
          setFunFact('We found your state. You are all set!');
        }
        setError(null);
      } else {
        setFunFact(null);
        setError('Please enter a valid US ZIP code.');
      }
    } else {
      setDetectedState(null);
      setFunFact(null);
      setError(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Your State</Text>
        <Text style={styles.subtitle}>
          This helps us provide location-specific information and regulations
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ZIP Code</Text>
          <TextInput
            value={zip}
            onChangeText={handleZipChange}
            keyboardType="numeric"
            inputMode="numeric"
            maxLength={5}
            placeholder="e.g., 98109"
            style={styles.input}
            placeholderTextColor={theme.colors.text.tertiary}
            returnKeyType="done"
            autoFocus
          />
          <Text style={styles.helperText}>Enter 5-digit ZIP to auto-detect state</Text>

          <View style={styles.statePreview}>
            <Text style={styles.statePreviewLabel}>Detected state</Text>
            <Text style={styles.statePreviewValue}>
              {detectedState ?? '—'}
            </Text>
          </View>

          {detectedState && (
            <View style={styles.stateCard}>
              <View style={styles.stateCardHeader}>
                <Text style={styles.stateCardTitle}>
                  {detectedState} {STATE_ABBREVIATIONS[detectedState] ? `(${STATE_ABBREVIATIONS[detectedState]})` : ''}
                </Text>
              </View>
              <View style={styles.stateCardBody}>
                <View style={styles.mapIcon}>
                  <Text style={styles.mapIconText}>🗺️</Text>
                </View>
                <View style={styles.factArea}>
                  <Text style={styles.factLabel}>Did you know?</Text>
                  <Text style={styles.factText}>{funFact ?? 'We found your state. You are all set!'}</Text>
                </View>
              </View>
            </View>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>

      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !detectedState && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!detectedState}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  body: {
    flex: 1,
    padding: theme.layout.screenPadding,
  },
  header: {
    padding: theme.layout.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary.terracotta,
    fontWeight: theme.typography.fontWeight.medium,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal,
  },
  statesList: {
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxl,
  },
  continueButton: {
    backgroundColor: theme.colors.primary.terracotta,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    flex: 1,
  },
  continueButtonDisabled: {
    backgroundColor: theme.colors.neutral.gray,
    opacity: 0.6,
  },
  continueButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  inputGroup: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  helperText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  statePreview: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  statePreviewLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  statePreviewValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  stateCard: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  stateCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stateCardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  stateCardBody: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  mapIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: theme.colors.primary.sageGreenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIconText: {
    fontSize: 28,
  },
  factArea: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  factLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.terracotta,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  factText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.md,
  },
  errorText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.semantic.error,
    fontSize: theme.typography.fontSize.sm,
  },
  stickyFooter: {
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
  },
});
