const path = require('path') // Подключение модуля 'path' для работы с путями в файловой системе
const HtmlWebpackPlugin = require('html-webpack-plugin') // Подключение плагина HtmlWebpackPlugin для работы с HTML-файлами на основе шаблона
// const CopyWebpackPlugin = require('copy-webpack-plugin') // Плагин для копирования файлов
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // Плагин для очистки директории с выходными файлами перед каждой новой сборкой
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // Плагин для извлечения CSS-кода в отдельные файлы
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin') // Плагин для минимизации CSS-кода (удаляет проблеы, комменты и оптимизирует стили)
const TerserPlugin = require('terser-webpack-plugin') // Плагин для минимизации JS-кода (убирает неиспользуемый код и уменьшает размер файлов)
const EslintWebpackPlugin = require('eslint-webpack-plugin') // Плагин для проверки JS/TS-файлов на ошибки с использованием ESlint 
                                                            // (может автоматически исправлять некоторые проблемы)
const IS_DEV = process.env.NODE.ENV === 'development' // Проверка текущего окружения (если 'development', то это режим разработки)
const IS_PROD = !IS_DEV // если не разработка, то продакшн

const cssLoaders = (extra) => {
  const loaders = [
    MiniCssExtractPlugin.loader, // Извлекает CSS-код в отдельные файлы
    'css-loader', // Обрабатывает CSS-файлы, позволяет использовать '@import' и 'url()' в стилях
  ];
if (extra) {
  loaders.push(extra) // Добавляет дополнительные загрузчики (например, для LESS или SASS, если указаны)
}
  return loaders // Возвращает массив загрузчиков для конфигурации
}

const jsLoaders = (extra) => {
  const loaders = {
    loader: "babel-loader", // Транспиляция JS для старых браузеров
    options: {
      presets: [
        '@babel/preset-env',
      ]
    }
  }
  if (extra) {
    loaders.options.presets.push(extra) // Добавляет доп.пресеты, например, для React или TS
  }
  return loaders // Возвращает объект с конфигурацией загрузчика
}

const optimization = () => {
  return {
    splitChunks: {
      chunks: 'all', // Позволяет разделять общий код (например, библиотеки) в отдельные чанки, чтобы использовать их повторно
    },
    minimizer: [
      new CssMinimizerWebpackPlugin(), // Минимизирует CSS-файлы для уменьшения их размера
      new TerserPlugin(), // Минимизирует JS-файлы для уменьшения их размера
    ]
  }
} 

const setPlugins = () => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: './index.html' // Исходный HTML для использования в качестве шаблона
    }),
    new CleanWebpackPlugin(),
    // new CopyWebpackPlugin({
    //    patterns: [ // patterns - список правил для копирования файлов, где указывается исходный путь (from) и путь назначения (to)
    //     {
    //       from: path.resolve(__dirname, 'src/assets/images/word-hey.jpg'), // Абсолютный путь к директории, в которую будут выводиться скомпилированные файлы
    //       // __dirname -  это переменная, которая указывает абсолютный путь к каталогу, содержащему текущий исполняемый файл
    //       to: path.resolve(__dirname, 'docs/assets/images'),
    //     },
    //     {
    //       from: path.resolve(__dirname, 'src/assets/fonts/Roboto-Regular.woff'),
    //       to: path.resolve(__dirname, 'docs/assets/fonts'),
    //     },
    //   ],
    // }),
    new MiniCssExtractPlugin({
      filename: 'assets/styles/style.[contenthash].css', // Сохранение всех CSS-файлов в папку styles
    }),
    new EslintWebpackPlugin({
      extensions: ['js'], // Указывает, какие файлы должны проверяться
      fix: true // Автоматически исправляет некоторые проблемы, найденные ESlint
    }),
  ]
  if(IS_PROD) {
    //code
  }
  if(IS_DEV) {
    //code
  }
  return plugins;
}

module.exports = { // module.exports — это способ экспорта объекта, функции или любого другого значения из модуля в Node.js
  context: path.resolve(__dirname,'src'),
  mode: 'development',
  entry: {
    main: './ts/main.ts',
    stat: './js/script.js',
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'bundle.[contenthash].js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname,'src'),
      '@css': path.resolve(__dirname,'src/styles'),
      '@assets': path.resolve(__dirname,'src/assets'),
    },
    extensions: ['.js', '.json', '.ts'],
  },
  optimization: optimization(),
  plugins: setPlugins(),
  devServer: {
    port: 3000,
    hot: false,
  },
  devtool: IS_DEV ? 'source-map' : false, // Включает карты кода только в режиме разработки для упрощения отладки
  module: {
    rules: [
   { test: /\.less$/,
        use: cssLoaders('less-loader')
      },
      {
        test: /\.scss$/,
        use: cssLoaders('sass-loader')
      },
    {
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: jsLoaders(),
    },
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: jsLoaders('@babel/preset-typescript'),
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource', // Использует Webpack для обработки и сохранения файлов
      generator: {
        filename: 'assets/images/[name][contenthash][ext]',
      },
    },
    {
      test: /\.(woff|woff2|ttf|eot)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'assets/fonts/[name].[contenthash][ext]',
     },
      },
    ],
  },
};