import { theme as origTheme, extendTheme, withDefaultColorScheme } from '@chakra-ui/react'

const colors = {}

// 2. Call `extendTheme` and pass your custom values
export const appTheme = extendTheme({
    components: {
        Alert: {
            variants: {
                subtle: (props) => {
                    const { status } = props

                    if (status === 'warning') {
                        return {
                            container: {
                                bg: '#FF8C00',
                                color: '#FFFFFF',
                            },
                            icon: { color: '#FFFFFF' },
                            description: { fontWeight: 600 },
                        }
                    } else if (status === 'error') {
                        return {
                            container: {
                                bg: '#E72424',
                                color: '#FFFFFF',
                            },
                            icon: { color: '#FFFFFF' },
                            description: { fontWeight: 600 },
                        }
                    } else if (status === 'success') {
                        return {
                            container: {
                                bg: '#56C023',
                                color: '#FFFFFF',
                                borderRadius: '15px',
                            },
                            icon: { color: '#FFFFFF' },
                            description: { fontWeight: 600 },
                        }
                    }
                    return origTheme.components.Alert.variants.subtle(props)
                },
            },
        },
    },
    colors,
    fonts: {
        heading: 'Outfit, sans-serif',
        body: 'Outfit, sans-serif',
    },
})
