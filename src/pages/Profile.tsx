import BasicView from '../components/BasicView';

interface ProfileProps {
  setCurrentPage: (pageName: string) => void;
}
const Profile: React.FC<ProfileProps> = ({ setCurrentPage }: ProfileProps) => {
  setCurrentPage('Profile');

  return (
    <BasicView viewPadding={false}>
        <div>profile</div>
    </BasicView>
  )
}

export default Profile;
