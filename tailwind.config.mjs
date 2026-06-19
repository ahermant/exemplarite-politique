/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        party: {
          lfi: '#E63946',
          rn: '#0D1B3E',
          re: '#FFB700',
          lr: '#0066CC',
          ps: '#FF69B4',
          pcf: '#DD0000',
          eelv: '#00A95C',
          udi: '#7B2D8E',
          rec: '#1E3A8A',
          nfp: '#E63946',
          horizons: '#00A1D6',
          modem: '#FF8C22',
          dlf: '#173F73',
          ls: '#1A3A5C',
        },
      },
    },
  },
  plugins: [],
};
