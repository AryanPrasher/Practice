import { useAuth } from "../context/AuthContext";

export default function Avatar() {
  const { user } = useAuth();        // read straight from AuthContext

  if (!user) {
    return <div className="avatar avatar-guest">?</div>;
  }

  return (
    <div className="avatar">
      <img src={user.avatarUrl} alt={user.name} />
      <span>{user.name}</span>
    </div>
  );
}
