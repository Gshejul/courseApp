import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Divider,
} from '@mui/material'
import { users as usersApi } from '../services/api'
import CourseCard from '../components/CourseCard'

const Profile = () => {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await usersApi.getProfile()
      setProfile(response.data)
      setFormData((prev) => ({
        ...prev,
        name: response.data.name,
        email: response.data.email,
      }))
    } catch (err: any) {
      setError('Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError('New passwords do not match')
      return
    }

    try {
      await usersApi.updateProfile({
        name: formData.name,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })
      setSuccess('Profile updated successfully')
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile')
    }
  }

  if (loading) {
    return (
      <Container>
        <Typography>Loading profile...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Profile Settings
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                disabled
                fullWidth
                margin="normal"
              />
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <TextField
                label="Current Password"
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="New Password"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
              >
                Update Profile
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Enrolled Courses
            </Typography>
            <Box sx={{ mt: 2 }}>
              {profile?.enrolledCourses?.length > 0 ? (
                <Grid container spacing={3}>
                  {profile.enrolledCourses.map((course: any) => (
                    <Grid item xs={12} key={course._id}>
                      <CourseCard course={course} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary">
                  You haven't enrolled in any courses yet.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Profile
