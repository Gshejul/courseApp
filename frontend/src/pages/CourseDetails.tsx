import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { courses as coursesApi } from '../services/api'

const CourseDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrolling, setEnrolling] = useState(false)
  const [enrollmentError, setEnrollmentError] = useState('')

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      const response = await coursesApi.getById(id!)
      setCourse(response.data)
    } catch (err: any) {
      setError('Failed to fetch course details')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setEnrolling(true)
    setEnrollmentError('')

    try {
      await coursesApi.enroll(id!)
      // Refresh course data to update enrollment status
      fetchCourse()
    } catch (err: any) {
      setEnrollmentError(err.response?.data?.message || 'Failed to enroll in course')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <Typography>Loading course details...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  if (!course) {
    return (
      <Container>
        <Typography>Course not found</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {course.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={course.category} />
              <Chip label={course.level} />
            </Box>
            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={course.averageRating} precision={0.5} readOnly />
              <Typography variant="body2">
                ({course.ratings.length} ratings)
              </Typography>
            </Box>
            <Typography variant="h5" color="primary" gutterBottom>
              ${course.price}
            </Typography>
            {enrollmentError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {enrollmentError}
              </Alert>
            )}
            <Button
              variant="contained"
              size="large"
              onClick={handleEnroll}
              disabled={enrolling || (user && course.enrolled)}
            >
              {enrolling
                ? 'Enrolling...'
                : user && course.enrolled
                ? 'Enrolled'
                : 'Enroll Now'}
            </Button>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Course Content
            </Typography>
            <List>
              {course.content.map((item: any, index: number) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.title}
                    secondary={item.description}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Instructor
            </Typography>
            <Typography variant="body1" gutterBottom>
              {course.instructor.name}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Course Features
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Duration"
                  secondary={`${course.duration} hours`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Lectures"
                  secondary={`${course.content.length} lectures`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Level"
                  secondary={course.level}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Category"
                  secondary={course.category}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default CourseDetails
