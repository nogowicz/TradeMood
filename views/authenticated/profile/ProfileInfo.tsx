import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from 'store/AuthProvider'
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'store/ThemeContext';

import CustomImage from 'components/custom-image'
import { constants, spacing, typography } from 'styles';

export default function ProfileInfo() {
  const { user } = useAuth();
  const theme = useTheme();
  return (
    <View style={styles.container}>
      {user?.photoURL ?
        <CustomImage
          url={user?.photoURL}
          style={styles.imageStyle}
        />
        :
        <CustomImage
          source={require('assets/profile/profile-picture.png')}
          style={styles.imageStyle}
        />
      }
      <View style={styles.sectionTitleContainer}>
        <Text style={[styles.sectionTitle, { color: theme.TERTIARY }]}>
          <FormattedMessage
            defaultMessage='Hello, '
            id='views.home.profile.title'
          />
        </Text>
        <Text style={[styles.sectionTitle, { color: theme.TERTIARY }]}>
          {user?.isAnonymous ?
            <FormattedMessage
              defaultMessage='Stranger'
              id='views.home.welcome-text.anonymous'
            />
            :
            user?.displayName?.split(" ")[0]}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.SCALE_16
  },
  sectionTitle: {
    ...typography.FONT_BOLD,
    fontSize: typography.FONT_SIZE_28,
    fontWeight: typography.FONT_WEIGHT_BOLD,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
  },
  imageStyle: {
    width: constants.ICON_SIZE.PROFILE_IMAGE,
    height: constants.ICON_SIZE.PROFILE_IMAGE,
    borderRadius: constants.ICON_SIZE.PROFILE_IMAGE / 2
  }
})