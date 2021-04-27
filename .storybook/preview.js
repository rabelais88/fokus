import Document from '@/containers/Document';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (Story) => (
    <Document resetCSS>
      <Story />
    </Document>
  ),
];
