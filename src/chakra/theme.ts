import { ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

export const theme = extendTheme(
    { config },
    {
        colors: {
            brand: {
                100: "#f7fafc", // "#3d84f7",
                200: "#87CEEB",
                // ...
                900: "#1a202c",
            },
            background: {
                700: "RGBA(255, 255, 255, 0.1)",
                800: "RGBA(255, 255, 255, 0.05)",
                900: "#1a202c",
            },
            button: {
                primary: "#805AD5",
                "primary.hover": "#6B46C1",
                secondary: "RGBA(255, 255, 255, 0.24)",
                "secondary.hover": "RGBA(255, 255, 255, 0.36)",
            },
            color: {
                50: "RGBA(255, 255, 255, 0.04)",
                400: "RGBA(255, 255, 255, 0.24)",
                500: "RGBA(255, 255, 255, 0.36)",
                700: "RGBA(255, 255, 255, 0.64)",
                800: "RGBA(255, 255, 255, 0.80)",
                900: "RGBA(255, 255, 255, 0.92)",
            },
            tab: {
                50: "#FAF5FF",
                100: "#FAF5FF",
                200: "#FAF5FF",
                300: "#FAF5FF",
                400: "#FAF5FF",
                500: "#FAF5FF",
                600: "#FAF5FF",
                700: "#FAF5FF",
                800: "#FAF5FF",
                900: "#FAF5FF",
            },
        },
        styles: {
            global: () => ({
                body: {
                    bg: "background.900",
                    color: "color.900",
                },
            }),
        },
        // fonts: {
        //     heading: "Poppins",
        //     body: "Poppins",
        // },
    }
);
