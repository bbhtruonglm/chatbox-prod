# Command
start server with development env: ```npm run dev```
start server with staging env: ```npm run staging```
start server with production env: ```npm run prod```

build code with development env: ```npm run build-dev```
build code with staging env: ```npm run build-staging```
build code with production env: ```npm run build``` or ```npm run build-prod```

# Features
1. Login 
2. Kết nối, chọn page 
3. Conversation & Filter
4. Message & Widget

# Tailwind example
```
.btn-blue {
  background-color: theme(colors.blue.500);
}
@media screen(sm) {
  /* ... */
}
@layer components {
  .btn-primary {
    @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
  }
}
```
# Responsive
```
bg-green-500 
md:bg-red-100 
xl:bg-blue-100
```

# Lib
- https://swiperjs.com/demos/430-slideable-menu/core