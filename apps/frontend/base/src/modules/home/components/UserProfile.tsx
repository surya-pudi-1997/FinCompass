import React, { useEffect } from "react";
import { Box, Typography, Button, Paper } from "@fin-compass/ui";
import { useGetProfile } from "../services/useGetProfile";
import { useUserProfileStore } from "../../../store/useUserProfileStore";

const UserProfile = () => {
  const { fetchUserProfile } = useGetProfile();
  const user = useUserProfileStore((state) => state.user);
  const loading = useUserProfileStore((state) => state.loading);
  const error = useUserProfileStore((state) => state.error);

  useEffect(() => {
    // Automatically fetch user profile when component mounts
    fetchUserProfile();
  }, []);

  const handleRefresh = () => {
    fetchUserProfile();
  };
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.primary">Loading user profile...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error: {error}</Typography>
        <Button onClick={handleRefresh} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.primary">No user profile found</Typography>
        <Button onClick={handleRefresh} sx={{ mt: 2 }}>
          Load Profile
        </Button>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 2 }}>
      <Paper
        sx={{
          p: 3,
          maxWidth: 500,
        }}
      >
        {" "}
        <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
          Hi {user.fullName},
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Your Net Worth is</strong>{" "}
          {user.networth
            ? `${user.networth.toLocaleString()} ${user.preferredCurrency}`
            : "N/A"}
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserProfile;
