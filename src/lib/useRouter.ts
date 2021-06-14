import { useHistory } from 'react-router-dom';

const useRouter = () => {
  const history = useHistory();
  const redirect = (target: string) => history.push(target);
  return { redirect };
};

export default useRouter;
