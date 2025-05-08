   // src/components/layout/Layout.tsx
   import React from 'react'
   import Header from './Header'
   import Footer from './Footer'

   type Props = { children: React.ReactNode }

   const Layout = ({ children }: Props) => (
     <div className="flex flex-col min-h-screen">
       <Header />
       <main className="flex-grow py-20">{children}</main>
       <Footer />
     </div>
   )

   export default Layout