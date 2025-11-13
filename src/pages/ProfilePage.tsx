import { useState } from "react";
import { Button } from "../components/Button";
import { Select } from "../components/Input";
import { useData } from "../contexts/DataContext";
import { formatCurrency, formatDate } from "../utils/format";

export const ProfilePage = () => {
  const { users, currentUser, setCurrentUserId, simulatePayout } = useData();
  const [message, setMessage] = useState<string | null>(null);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value;
    setCurrentUserId(userId);
    setMessage(null);
  };

  const handlePayout = () => {
    if (!currentUser) return;
    simulatePayout(currentUser.id);
    setMessage(
      "Vipps-utbetaling simulert. I en ekte versjon ville pengene vært sendt til din konto."
    );
  };

  return (
    <div className="section">
      <div className="container card profile-card">
        <h1>Profil (demo)</h1>
        <p>
          Velg hvilken demobruker du vil representere. All data lagres i nettleserens
          localStorage.
        </p>

        <Select
          label="Velg bruker"
          value={currentUser?.id ?? ""}
          onChange={handleUserChange}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} – {user.university} ({user.role})
            </option>
          ))}
        </Select>

        {currentUser && (
          <div className="profile-info">
            <div>
              <strong>Navn:</strong> {currentUser.name}
            </div>
            <div>
              <strong>E-post:</strong> {currentUser.email}
            </div>
            <div>
              <strong>Universitet:</strong> {currentUser.university}
            </div>
            <div>
              <strong>Land:</strong> {currentUser.country}
            </div>
            <div>
              <strong>Rolle:</strong> {currentUser.role}
            </div>
            <div>
              <strong>Balanse:</strong> {formatCurrency(currentUser.balanceNOK)}
            </div>
            <div>
              <strong>Med siden:</strong> {formatDate(currentUser.joinedAt)}
            </div>
          </div>
        )}

        <Button onClick={handlePayout} disabled={!currentUser}>
          Simuler utbetaling
        </Button>

        {message && <div className="profile-message">{message}</div>}
      </div>
    </div>
  );
};

