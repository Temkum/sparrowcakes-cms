import Footer from '@/components/Footer';
import LoginForm from '@/components/LoginForm';
import HeaderBottom from '@/components/ui/HeaderBottom';
import HeaderTop from '@/components/ui/HeaderTop';
import { HeaderTopProps } from '@/types';

const Login = ({ toggleSidebar }: HeaderTopProps) => {
  return (
    <>
      <HeaderTop toggleSidebar={toggleSidebar} />
      <HeaderBottom />
      <LoginForm />
      <Footer />
    </>
  );
};

export default Login;
