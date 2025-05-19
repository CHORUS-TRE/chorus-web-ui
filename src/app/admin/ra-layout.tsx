import { Layout } from 'react-admin'

export const MyLayout = ({ children }: { children: React.ReactNode }) => (
  <Layout appBar={() => <></>} menu={() => <></>}>
    {children}
  </Layout>
)
