import { BsPeopleFill } from 'react-icons/bs';
import { FaMoneyBillAlt } from 'react-icons/fa';
import { GiCube } from 'react-icons/gi';
import { MdBusiness } from 'react-icons/md';
import { RiDashboardFill } from 'react-icons/ri';
import { AiFillApi, AiFillProject } from 'react-icons/ai';

const NavMenuItems = [
  {
    id: 1,
    url: '/',
    text: 'Painel',
    icon: RiDashboardFill,
    iconComponent: <RiDashboardFill />,
    permission: 'User',
  },
  {
    id: 2,
    url: '/negocios',
    text: 'Negócios',
    icon: FaMoneyBillAlt,
    iconComponent: <FaMoneyBillAlt />,
    permission: 'User',
  },
  {
    id: 3,
    url: '/empresas',
    text: 'Empresas',
    icon: MdBusiness,
    iconComponent: <MdBusiness />,
    permission: 'User',
  },
  {
    id: 4,
    url: '/produtos',
    text: 'Produtos',
    icon: GiCube,
    iconComponent: <GiCube />,
    permission: 'User',
  },
  {
    id: 5,
    url: '/vendedor',
    text: 'Vendedores',
    icon: BsPeopleFill,
    iconComponent: <BsPeopleFill />,
    permission: 'Adm',
  },
  {
    id: 6,
    url: '/producao',
    text: 'Fila de Produção',
    icon: AiFillProject,
    iconComponent: <AiFillProject />,
    permission: 'User',
  },
  {
    id: 97,
    url: '/',
    text: 'Login Ribermax',
    icon: AiFillApi,
    iconComponent: <AiFillApi />,
    permission: 'Adm',
  },
  {
    id: 98,
    url: '/',
    text: 'Login Renato',
    icon: AiFillApi,
    iconComponent: <AiFillApi />,
    permission: 'Adm',
  },
  {
    id: 99,
    url: '/',
    text: 'Login Bragheto',
    icon: AiFillApi,
    iconComponent: <AiFillApi />,
    permission: 'Adm',
  },

];

export default NavMenuItems;