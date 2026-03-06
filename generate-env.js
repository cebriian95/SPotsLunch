const fs = require('fs');

const content = `export const environment = {
  supabaseUrl: '${process.env.SUPABASE_URL}',
  supabaseKey: '${process.env.SUPABASE_KEY}',
  password: '${process.env.PASSWORD}'
};
`;
fs.mkdirSync('./src/environments', { recursive: true });
fs.writeFileSync('./src/environments/environment.ts', content);
console.log('environment.ts generado correctamente');