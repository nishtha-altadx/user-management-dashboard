import { useParams } from "react-router-dom";
import { useUser } from "../services/userService";

import { Loader } from "../components/ui/Loader/Loader";
import { EmptyState } from "../components/ui/EmptyState/EmptyState";

import "./UserDetailsPage.css";

export const UserDetailsPage = () => {
  const { id } = useParams();

  const { data: user, isLoading, error } = useUser(id ?? "");

  if (isLoading) {
    return <Loader />;
  }

  if (error || !user) {
    return <EmptyState title="Failed to load user" />;
  }

  return (
    <div className="user-details-page">
      <div className="user-card">
        <div className="user-header">
          <div className="avatar">{user.name.charAt(0)}</div>

          <div>
            <h1>{user.name}</h1>

            <p>@{user.username}</p>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-card">
            <h3>Email</h3>

            <p>{user.email}</p>
          </div>

          <div className="detail-card">
            <h3>Phone</h3>

            <p>{user.phone}</p>
          </div>

          <div className="detail-card">
            <h3>Website</h3>

            <p>{user.website}</p>
          </div>

          <div className="detail-card">
            <h3>Company</h3>

            <p>{user.company.name}</p>
          </div>

          <div className="detail-card">
            <h3>Catch Phrase</h3>

            <p>{user.company.catchPhrase}</p>
          </div>

          <div className="detail-card">
            <h3>Business</h3>

            <p>{user.company.bs}</p>
          </div>

          <div className="detail-card address-card">
            <h3>Address</h3>

            <p>
              {user.address.street}, {user.address.suite}
            </p>

            <p>{user.address.city}</p>

            <p>{user.address.zipcode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
