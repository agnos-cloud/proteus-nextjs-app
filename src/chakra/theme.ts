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
        },
        styles: {
            global: {
                // styles for the `body`
                body: {
                    bg: "brand.100", // "brand.100"
                    // color: "black",
                },
                // styles for the `a`
                // a: {
                //     color: "teal.500",
                //     _hover: {
                //         textDecoration: "underline",
                //     },
                // },
            },
        },
        // fonts: {
        //     heading: "Poppins",
        //     body: "Poppins",
        // },
    }
);
