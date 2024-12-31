import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { courses as coursesApi } from '../services/api'

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    level: '',
    duration: '',
    content: [{ title: '', description: '' }],
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await coursesApi.getCreatedCourses()
      setCourses(response.data)
    } catch (err: any) {
      setError('Failed to fetch courses')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (course?: any) => {
    if (course) {
      setSelectedCourse(course)
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price.toString(),
        category: course.category,
        level: course.level,
        duration: course.duration.toString(),
        content: course.content,
      })
    } else {
      setSelectedCourse(null)
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        level: '',
        duration: '',
        content: [{ title: '', description: '' }],
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedCourse(null)
    setError('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleContentChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newContent = [...prev.content]
      newContent[index] = { ...newContent[index], [field]: value }
      return { ...prev, content: newContent }
    })
  }

  const handleAddContent = () => {
    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, { title: '', description: '' }],
    }))
  }

  const handleRemoveContent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const courseData = {
      ...formData,
      price: parseFloat(formData.price),
      duration: parseFloat(formData.duration),
    }

    try {
      if (selectedCourse) {
        await coursesApi.update(selectedCourse._id, courseData)
      } else {
        await coursesApi.create(courseData)
      }
      setSuccess(
        `Course ${selectedCourse ? 'updated' : 'created'} successfully`
      )
      handleCloseDialog()
      fetchCourses()
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `Failed to ${selectedCourse ? 'update' : 'create'} course`
      )
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return
    }

    try {
      await coursesApi.delete(courseId)
      setSuccess('Course deleted successfully')
      fetchCourses()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete course')
    }
  }

  if (loading) {
    return (
      <Container>
        <Typography>Loading dashboard...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Instructor Dashboard</Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
        >
          Create New Course
        </Button>
      </Box>

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

      <Grid container spacing={4}>
        {courses.map((course: any) => (
          <Grid item xs={12} key={course._id}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">{course.title}</Typography>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    {course.enrolledStudents?.length || 0} students enrolled
                  </Typography>
                  <Typography variant="body2">{course.description}</Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => handleOpenDialog(course)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteCourse(course._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}

        {courses.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary" align="center">
              You haven't created any courses yet.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCourse ? 'Edit Course' : 'Create New Course'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duration (hours)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleChange}
                  >
                    <MenuItem value="programming">Programming</MenuItem>
                    <MenuItem value="design">Design</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                    <MenuItem value="marketing">Marketing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Level</InputLabel>
                  <Select
                    name="level"
                    value={formData.level}
                    label="Level"
                    onChange={handleChange}
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Course Content
                </Typography>
                {formData.content.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={11}>
                        <TextField
                          label={`Lecture ${index + 1} Title`}
                          value={item.title}
                          onChange={(e) =>
                            handleContentChange(index, 'title', e.target.value)
                          }
                          fullWidth
                          required
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          label="Description"
                          value={item.description}
                          onChange={(e) =>
                            handleContentChange(
                              index,
                              'description',
                              e.target.value
                            )
                          }
                          fullWidth
                          multiline
                          rows={2}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          onClick={() => handleRemoveContent(index)}
                          disabled={formData.content.length === 1}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Button onClick={handleAddContent}>Add Lecture</Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}

export default InstructorDashboard
