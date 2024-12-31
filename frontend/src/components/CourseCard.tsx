import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Rating,
    Box,
    Chip,
    CardActions,
  } from '@mui/material'
  import { useNavigate } from 'react-router-dom'
  
  interface Course {
    _id: string
    title: string
    description: string
    price: number
    image: string
    category: string
    level: string
    averageRating: number
    ratings: any[]
    instructor: {
      name: string
    }
  }
  
  interface CourseCardProps {
    course: Course
  }
  
  const CourseCard = ({ course }: CourseCardProps) => {
    const navigate = useNavigate()
  
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="140"
          image={course.image || '/default-course.jpg'}
          alt={course.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {course.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {course.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            By {course.instructor.name}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={course.averageRating} precision={0.5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              ({course.ratings.length})
            </Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Chip
              label={course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip label={course.category} size="small" />
          </Box>
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            ${course.price}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate(`/courses/${course._id}`)}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    )
  }
  
  export default CourseCard
  