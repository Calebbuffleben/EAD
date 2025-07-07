'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { useEffect, useState } from "react"
import { coursesApi, Course } from "@/lib/api/courses"
import { 
  Search, 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  Play, 
  Award, 
  Zap, 
  Heart, 
  Eye, 
  Grid3X3,
  List,
  ShoppingCart,
  Filter as FilterIcon,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react"

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const allCourses = await coursesApi.getAll();
        setCourses(allCourses);
        setFilteredCourses(allCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = [...courses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.organization?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    if (selectedPrice === 'free') {
      filtered = filtered.filter(course => course.price === 0);
    } else if (selectedPrice === 'paid') {
      filtered = filtered.filter(course => course.price > 0);
    }

    // Price range filter
    filtered = filtered.filter(course => 
      course.price >= priceRange[0] && course.price <= priceRange[1]
    );

    // Organization filter
    if (selectedOrganizations.length > 0) {
      filtered = filtered.filter(course => 
        course.organization && selectedOrganizations.includes(course.organization.id)
      );
    }

    // Sort courses
    switch (selectedSort) {
      case 'popular':
        filtered.sort((a, b) => (b._count?.purchases || 0) - (a._count?.purchases || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => (b._count?.purchases || 0) - (a._count?.purchases || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedPrice, selectedSort, priceRange, selectedOrganizations]);

  const getCourseLevel = (course: Course) => {
    const purchaseCount = course._count?.purchases || 0;
    if (purchaseCount > 1000) return { level: 'Advanced', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
    if (purchaseCount > 500) return { level: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    return { level: 'Beginner', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
  };

  const getCourseRating = (course: Course) => {
    const baseRating = 4.0;
    const purchaseBonus = Math.min((course._count?.purchases || 0) / 100, 1);
    return (baseRating + purchaseBonus).toFixed(1);
  };

  const getCourseDuration = (course: Course) => {
    const chapters = course._count?.chapters || 0;
    const hours = Math.max(1, Math.floor(chapters * 0.5));
    return `${hours}h`;
  };

  const toggleWishlist = (courseId: string) => {
    setWishlist(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const toggleCart = (courseId: string) => {
    setCart(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const getUniqueOrganizations = () => {
    const orgs = courses
      .map(course => course.organization)
      .filter(Boolean)
      .filter((org, index, self) => 
        index === self.findIndex(o => o?.id === org?.id)
      );
    return orgs;
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPrice('all');
    setSelectedSort('popular');
    setPriceRange([0, 500]);
    setSelectedOrganizations([]);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        </div>
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>

        {/* Search and Filter Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Courses Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Course Marketplace</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Discover and enroll in courses from expert instructors and organizations
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Courses</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {courses.reduce((sum, course) => sum + (course._count?.purchases || 0), 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Students Enrolled</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {courses.filter(c => c.price === 0).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Free Courses</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {getUniqueOrganizations().length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Organizations</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search courses, instructors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FilterIcon className="h-4 w-4" />
            Filters
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Filter */}
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Organization Filter */}
              <div>
                <h4 className="font-medium mb-3">Organizations</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {getUniqueOrganizations().map((org) => (
                    <div key={org?.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={org?.id}
                        checked={selectedOrganizations.includes(org?.id || '')}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setSelectedOrganizations(prev => [...prev, org?.id || '']);
                          } else {
                            setSelectedOrganizations(prev => prev.filter(id => id !== org?.id));
                          }
                        }}
                      />
                      <label htmlFor={org?.id} className="text-sm">
                        {org?.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h4 className="font-medium mb-3">Quick Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Free Courses:</span>
                    <span className="font-medium">{courses.filter(c => c.price === 0).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid Courses:</span>
                    <span className="font-medium">{courses.filter(c => c.price > 0).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Published:</span>
                    <span className="font-medium">{courses.filter(c => c.isPublished).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Draft:</span>
                    <span className="font-medium">{courses.filter(c => !c.isPublished).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">All Courses</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Heart className="h-4 w-4 text-red-500" />
            <span>{wishlist.length} in wishlist</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ShoppingCart className="h-4 w-4 text-blue-500" />
            <span>{cart.length} in cart</span>
          </div>
        </div>
      </div>

      {/* Courses Grid/List */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredCourses.map((course) => (
            <Card key={course.id} className={`group hover:shadow-lg transition-all duration-300 ${
              viewMode === 'list' ? 'flex' : ''
            }`}>
              <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                <div className={`bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 ${
                  viewMode === 'list' ? 'h-32' : 'h-48'
                }`}>
                  {course.thumbnail && (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className={getCourseLevel(course).color}>
                    {getCourseLevel(course).level}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {getCourseRating(course)}
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                      wishlist.includes(course.id) ? 'bg-red-100 text-red-600' : ''
                    }`}
                    onClick={() => toggleWishlist(course.id)}
                  >
                    <Heart className={`h-4 w-4 ${wishlist.includes(course.id) ? 'fill-red-500' : ''}`} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                      cart.includes(course.id) ? 'bg-blue-100 text-blue-600' : ''
                    }`}
                    onClick={() => toggleCart(course.id)}
                  >
                    <ShoppingCart className={`h-4 w-4 ${cart.includes(course.id) ? 'fill-blue-500' : ''}`} />
                  </Button>
                </div>
                {!course.isPublished && (
                  <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-white text-center py-1 text-xs font-medium">
                    Draft
                  </div>
                )}
              </div>
              <div className={`flex-1 ${viewMode === 'list' ? 'p-6' : ''}`}>
                <CardHeader className={`pb-3 ${viewMode === 'list' ? 'pt-0' : ''}`}>
                  <CardTitle className={`group-hover:text-blue-600 transition-colors ${
                    viewMode === 'list' ? 'text-xl' : 'text-lg'
                  }`}>
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description || 'No description available.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course._count?.chapters || 0} chapters
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getCourseDuration(course)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course._count?.purchases || 0} students
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {course.price === 0 ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Free
                        </Badge>
                      ) : (
                        <span className="text-2xl font-bold text-green-600">
                          ${course.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/courses/${course.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/courses/${course.id}`}>
                          <Play className="h-4 w-4 mr-2" />
                          Enroll
                        </Link>
                      </Button>
                    </div>
                  </div>
                  {course.organization && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          {course.organization.logo ? (
                            <img 
                              src={course.organization.logo} 
                              alt={course.organization.name}
                              className="w-4 h-4 rounded-full"
                            />
                          ) : (
                            <span className="text-xs font-medium">
                              {course.organization.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span>by {course.organization.name}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg mt-12">
        <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ready to Start Learning?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Join thousands of students who are already advancing their careers with our expert-led courses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/auth">
              <Zap className="h-5 w-5 mr-2" />
              Get Started Today
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 