import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Star, 
  Users, 
  BookOpen, 
  Award, 
  Zap, 
  CheckCircle, 
  Play,
  TrendingUp,
  Shield,
  Clock,
  Globe
} from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)]/5 via-[var(--accent)]/5 to-purple-50">
          <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-[var(--primary)]/10 to-transparent"></div>
          <div className="container mx-auto px-8 py-24 relative">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 text-sm">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                Trusted by 10,000+ students worldwide
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Master New Skills with
                <span className="text-gradient block"> Expert-Led Courses</span>
              </h1>
              <p className="text-xl text-[var(--secondary)] mb-8 leading-relaxed max-w-2xl mx-auto">
                Transform your career with our comprehensive online learning platform. 
                Access world-class courses from industry experts and learn at your own pace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="xl" asChild className="group">
                  <Link href="/courses">
                    Start Learning Today
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link href="/about">
                    <Play className="h-5 w-5 mr-2" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-[var(--secondary)]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free courses available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Certificate upon completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Lifetime access</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-2">500+</div>
                <div className="text-[var(--secondary)]">Expert Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--accent)] mb-2">50K+</div>
                <div className="text-[var(--secondary)]">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-2">100+</div>
                <div className="text-[var(--secondary)]">Expert Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--accent)] mb-2">95%</div>
                <div className="text-[var(--secondary)]">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-[var(--muted)]">
          <div className="container mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
              <p className="text-xl text-[var(--secondary)] max-w-2xl mx-auto">
                Experience the best in online education with our cutting-edge features and expert-led courses.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover-lift group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-8 w-8 text-[var(--primary)]" />
                  </div>
                  <CardTitle>Expert-Led Courses</CardTitle>
                  <CardDescription>
                    Learn from industry professionals and certified experts who bring real-world experience to every lesson.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-lift group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent)]/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="h-8 w-8 text-[var(--accent)]" />
                  </div>
                  <CardTitle>Learn at Your Pace</CardTitle>
                  <CardDescription>
                    Access course content 24/7 and progress through lessons at your own comfortable speed.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-lift group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Certificates & Recognition</CardTitle>
                  <CardDescription>
                    Earn professional certificates upon completion to showcase your new skills and advance your career.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-lift group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Community Support</CardTitle>
                  <CardDescription>
                    Connect with fellow learners, share experiences, and get help from our supportive community.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-lift group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="h-8 w-8 text-yellow-600" />
                  </div>
                  <CardTitle>Secure & Reliable</CardTitle>
                  <CardDescription>
                    Your data and progress are protected with enterprise-grade security and reliable infrastructure.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-lift group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Globe className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Global Access</CardTitle>
                  <CardDescription>
                    Access your courses from anywhere in the world with our mobile-optimized platform.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular Courses Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Popular Courses</h2>
              <p className="text-xl text-[var(--secondary)] max-w-2xl mx-auto">
                Discover our most popular courses and start your learning journey today.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                {
                  title: "Complete Web Development Bootcamp",
                  instructor: "Sarah Johnson",
                  rating: 4.8,
                  students: 15420,
                  price: 89.99,
                  level: "Beginner",
                  badge: "Bestseller"
                },
                {
                  title: "Data Science & Machine Learning",
                  instructor: "Dr. Michael Chen",
                  rating: 4.9,
                  students: 12350,
                  price: 129.99,
                  level: "Intermediate",
                  badge: "Hot"
                },
                {
                  title: "Digital Marketing Masterclass",
                  instructor: "Emma Rodriguez",
                  rating: 4.7,
                  students: 9870,
                  price: 69.99,
                  level: "All Levels",
                  badge: "New"
                }
              ].map((course, index) => (
                <Card key={index} className="hover-lift group overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 relative">
                    <div className="absolute top-4 left-4">
                      <Badge variant="success">{course.badge}</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-[var(--primary)] transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription>
                      by {course.instructor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-[var(--secondary)]">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students.toLocaleString()}
                        </div>
                        <Badge variant="outline">{course.level}</Badge>
                      </div>
                      <div className="text-2xl font-bold text-[var(--primary)]">
                        ${course.price}
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href="/courses">
                        Enroll Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/courses">
                  View All Courses
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5">
          <div className="container mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">What Our Students Say</h2>
              <p className="text-xl text-[var(--secondary)] max-w-2xl mx-auto">
                Join thousands of satisfied students who have transformed their careers with our platform.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Thompson",
                  role: "Software Developer",
                  content: "The web development course completely changed my career path. The instructors are amazing and the content is up-to-date with industry standards.",
                  rating: 5
                },
                {
                  name: "Maria Garcia",
                  role: "Marketing Manager",
                  content: "I learned more in 3 months with this platform than I did in 2 years of traditional education. Highly recommended!",
                  rating: 5
                },
                {
                  name: "David Kim",
                  role: "Data Analyst",
                  content: "The data science course provided me with practical skills that I use every day at work. The community support is incredible.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <Card key={index} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-[var(--secondary)] mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <div className="font-semibold text-[var(--foreground)]">{testimonial.name}</div>
                      <div className="text-sm text-[var(--secondary)]">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white">
          <div className="container mx-auto px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Career?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of students who are already advancing their careers with our expert-led courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="bg-white text-[var(--primary)] hover:bg-gray-100">
                <Link href="/courses">
                  <Zap className="h-5 w-5 mr-2" />
                  Get Started Today
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-[var(--primary)]">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[var(--foreground)] text-white py-12">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">E-Learning Platform</h3>
                <p className="text-gray-400">
                  Empowering learners worldwide with expert-led courses and cutting-edge technology.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Courses</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/courses" className="hover:text-white transition-colors">All Courses</Link></li>
                  <li><Link href="/courses?category=tech" className="hover:text-white transition-colors">Technology</Link></li>
                  <li><Link href="/courses?category=business" className="hover:text-white transition-colors">Business</Link></li>
                  <li><Link href="/courses?category=design" className="hover:text-white transition-colors">Design</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 E-Learning Platform. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
