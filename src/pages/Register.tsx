import Footer from '@/components/Footer';
import RegistrationForm from '@/components/RegisterForm';
import HeaderBottom from '@/components/ui/HeaderBottom';
import HeaderTop from '@/components/ui/HeaderTop';
import { HeaderTopProps } from '@/types';

const Register = ({ toggleSidebar }: HeaderTopProps) => {
  return (
    <>
      <HeaderTop toggleSidebar={toggleSidebar} />
      <HeaderBottom />
      <RegistrationForm />
      <Footer />
    </>
  );
};

export default Register;
