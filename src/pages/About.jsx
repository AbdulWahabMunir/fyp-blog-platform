/**
 * About Us Page Component
 * 
 * Static page containing information about the blog website.
 * Provides details about the platform's purpose and features.
 */

import './About.css'

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1 className="about-title">About Us</h1>
        
        <section className="about-section">
          <h2>Welcome to Our Blog Platform</h2>
          <p>
            Our blog platform is a modern, user-friendly space designed for writers and readers 
            to connect, share ideas, and explore diverse perspectives. Whether you're an aspiring 
            blogger or an avid reader, our platform provides the tools you need to create, share, 
            and discover compelling content.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            We believe in the power of storytelling and knowledge sharing. Our mission is to provide 
            a simple, accessible platform where everyone can express their thoughts, share their 
            experiences, and learn from others. We strive to create an inclusive community that 
            values diverse voices and perspectives.
          </p>
        </section>

        <section className="about-section">
          <h2>Features</h2>
          <ul className="features-list">
            <li>Easy blog creation and management</li>
            <li>Category-based organization</li>
            <li>Search functionality to find relevant content</li>
            <li>User-friendly interface for both authors and readers</li>
            <li>Secure user accounts with role-based access</li>
            <li>Edit and delete your own content</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Get Started</h2>
          <p>
            Ready to start your blogging journey? Create an account, write your first post, and 
            join our community of writers and readers. Whether you're sharing tutorials, personal 
            stories, or industry insights, your voice matters here.
          </p>
        </section>

        <section className="about-section">
          <h2>Contact</h2>
          <p>
            Have questions or feedback? We'd love to hear from you! Visit our{' '}
            <a href="/contact">Contact Us</a> page to get in touch.
          </p>
        </section>
      </div>
    </div>
  )
}

export default About








