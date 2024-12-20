declare module '*.jpg' {
  const value: string;
  export default value;
}

// Это говорит TypeScript, что все файлы с расширением .jpg являются строками (путь к изображению)