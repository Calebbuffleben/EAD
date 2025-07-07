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
  ChevronUp,
  TrendingUp,
  Sparkles,
  Target,
  Globe,
  Shield
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
    if (purchaseCount > 1000) return { level: 'Advanced', color: 'bg-gradient-to-r from-red-500 to-red-600 text-white' };
    if (purchaseCount > 500) return { level: 'Intermediate', color: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' };
    return { level: 'Beginner', color: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' };
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
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container mx-auto px-8 py-12">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3 mb-6 animate-shimmer"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-shimmer"></div>
            ))}
          </div>

          {/* Search and Filter Skeleton */}
          <div className="mb-12 space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-shimmer"></div>
              <div className="w-32 h-12 bg-gray-200 rounded-lg animate-shimmer"></div>
              <div className="w-32 h-12 bg-gray-200 rounded-lg animate-shimmer"></div>
            </div>
          </div>

          {/* Courses Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden hover-lift">
                <div className="h-48 bg-gray-200 animate-shimmer"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-gray-200 rounded-full animate-shimmer"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded-full animate-shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Oops! Something went wrong</h2>
          <p className="text-[var(--secondary)] mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-8 py-12">
        {/* Enhanced Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-sm font-medium text-[var(--primary)]">Discover Amazing Courses</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Explore Our
            <span className="text-gradient block"> Course Library</span>
          </h1>
          <p className="text-xl text-[var(--secondary)] max-w-3xl mx-auto leading-relaxed">
            Unlock your potential with our curated collection of high-quality courses from world-class instructors
          </p>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="hover-lift text-center group">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <div className="text-3xl font-bold text-[var(--primary)] mb-2">{courses.length}</div>
              <div className="text-sm text-[var(--secondary)]">Expert Courses</div>
            </CardContent>
          </Card>
          <Card className="hover-lift text-center group">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)]/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-[var(--accent)]" />
              </div>
              <div className="text-3xl font-bold text-[var(--accent)] mb-2">
                {courses.reduce((sum, course) => sum + (course._count?.purchases || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-[var(--secondary)]">Students Enrolled</div>
            </CardContent>
          </Card>
          <Card className="hover-lift text-center group">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {courses.filter(c => c.price === 0).length}
              </div>
              <div className="text-sm text-[var(--secondary)]">Free Courses</div>
            </CardContent>
          </Card>
          <Card className="hover-lift text-center group">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {getUniqueOrganizations().length}
              </div>
              <div className="text-sm text-[var(--secondary)]">Organizations</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--secondary)] h-5 w-5 group-focus-within:text-[var(--primary)] transition-colors" />
              <Input
                placeholder="Search courses, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-base"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 h-14 px-6"
            >
              <FilterIcon className="h-5 w-5" />
              Filters
              {showFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
            <Select value={selectedSort} onValueChange={setSelectedSort}>
              <SelectTrigger className="w-full md:w-48 h-14">
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
                className="h-14 px-4"
              >
                <Grid3X3 className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-14 px-4"
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Enhanced Advanced Filters */}
          {showFilters && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FilterIcon className="h-5 w-5 text-[var(--primary)]" />
                  Advanced Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-[var(--secondary)] hover:text-[var(--primary)]">
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Price Filter */}
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[var(--primary)]" />
                    Price Range
                  </h4>
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
                  <div className="mt-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-[var(--secondary)] mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Organization Filter */}
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[var(--accent)]" />
                    Organizations
                  </h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {getUniqueOrganizations().map((org) => (
                      <div key={org?.id} className="flex items-center space-x-3">
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
                        <label htmlFor={org?.id} className="text-sm cursor-pointer hover:text-[var(--primary)] transition-colors">
                          {org?.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-600" />
                    Course Statistics
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-green-700">Free Courses:</span>
                      <span className="font-semibold text-green-700">{courses.filter(c => c.price === 0).length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-700">Paid Courses:</span>
                      <span className="font-semibold text-blue-700">{courses.filter(c => c.price > 0).length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-700">Published:</span>
                      <span className="font-semibold text-purple-700">{courses.filter(c => c.isPublished).length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-yellow-700">Draft:</span>
                      <span className="font-semibold text-yellow-700">{courses.filter(c => !c.isPublished).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Enhanced Results Summary */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Course Results</h2>
            <p className="text-[var(--secondary)]">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm bg-red-50 px-3 py-2 rounded-full">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-red-700 font-medium">{wishlist.length} in wishlist</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-2 rounded-full">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
              <span className="text-blue-700 font-medium">{cart.length} in cart</span>
            </div>
          </div>
        </div>

        {/* Enhanced Courses Grid/List */}
        {filteredCourses.length === 0 ? (
          <Card className="hover-lift">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">No courses found</h3>
              <p className="text-[var(--secondary)] mb-6 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find the perfect course for you.
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "space-y-6"
          }>
            {filteredCourses.map((course) => (
              <Card key={course.id} className={`group hover-lift overflow-hidden ${
                viewMode === 'list' ? 'flex' : ''
              }`}>
                <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                  <div className={`bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 ${
                    viewMode === 'list' ? 'h-48' : 'h-56'
                  } relative overflow-hidden`}>
                    {course.thumbnail && (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={getCourseLevel(course).color}>
                      {getCourseLevel(course).level}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/95 text-[var(--foreground)] shadow-md">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {getCourseRating(course)}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                        wishlist.includes(course.id) ? 'bg-red-100 text-red-600' : 'bg-white/95'
                      }`}
                      onClick={() => toggleWishlist(course.id)}
                    >
                      <Heart className={`h-4 w-4 ${wishlist.includes(course.id) ? 'fill-red-500' : ''}`} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                        cart.includes(course.id) ? 'bg-blue-100 text-blue-600' : 'bg-white/95'
                      }`}
                      onClick={() => toggleCart(course.id)}
                    >
                      <ShoppingCart className={`h-4 w-4 ${cart.includes(course.id) ? 'fill-blue-500' : ''}`} />
                    </Button>
                  </div>
                  {!course.isPublished && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-center py-2 text-xs font-semibold">
                      Coming Soon
                    </div>
                  )}
                </div>
                <div className={`flex-1 ${viewMode === 'list' ? 'p-6' : ''}`}>
                  <CardHeader className={`pb-4 ${viewMode === 'list' ? 'pt-0' : ''}`}>
                    <CardTitle className={`group-hover:text-[var(--primary)] transition-colors ${
                      viewMode === 'list' ? 'text-xl' : 'text-lg'
                    } line-clamp-2`}>
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 leading-relaxed">
                      {course.description || 'No description available.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-[var(--secondary)]">
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
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        {course.price === 0 ? (
                          <Badge variant="success" className="text-sm">
                            Free
                          </Badge>
                        ) : (
                          <span className="text-2xl font-bold text-[var(--primary)]">
                            ${course.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/courses/${course.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
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
                      <div className="pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center gap-3 text-sm text-[var(--secondary)]">
                          <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-full flex items-center justify-center">
                            {course.organization.logo ? (
                              <img 
                                src={course.organization.logo} 
                                alt={course.organization.name}
                                className="w-5 h-5 rounded-full"
                              />
                            ) : (
                              <span className="text-xs font-bold text-[var(--primary)]">
                                {course.organization.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <span className="font-medium">by {course.organization.name}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Call to Action */}
        <div className="text-center py-16 bg-gradient-to-br from-[var(--primary)]/10 via-[var(--accent)]/10 to-purple-50 rounded-3xl mt-16">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg text-[var(--secondary)] mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who are already advancing their careers with our expert-led courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="group">
              <Link href="/auth">
                <Zap className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Get Started Today
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 