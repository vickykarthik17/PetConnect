import React from 'react';
import { Heart, Quote, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

function SuccessStories() {
  const stories = [
    {
      id: 1,
      petName: 'Max',
      petType: 'Golden Retriever',
      adopter: 'The Sharma Family',
      date: 'March 2024',
      image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      story: "Max has brought so much joy to our family. He's amazing with our kids and has become the perfect companion for our weekend hikes. We can't imagine life without him now!",
      beforeImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 2,
      petName: 'Luna',
      petType: 'Persian Cat',
      adopter: 'Priya Patel',
      date: 'February 2024',
      image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      story: "As someone living alone, Luna has been the perfect companion. She's so affectionate and always greets me at the door. She's made my apartment feel like a true home.",
      beforeImage: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 3,
      petName: 'Rocky',
      petType: 'German Shepherd',
      adopter: 'The Kumar Family',
      date: 'January 2024',
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      story: "Rocky has been an incredible addition to our family. He's not just a pet, he's our protector and loyal friend. The adoption process was smooth, and we're so grateful to have found him.",
      beforeImage: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Happy Tails: Our Success Stories
        </h1>
        <p className="text-xl text-gray-600">
          Read heartwarming stories from families who found their perfect match through PetConnect.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid gap-12">
        {stories.map((story) => (
          <div key={story.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Before & After Images */}
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={story.image}
                    alt={`${story.petName} with ${story.adopter}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full shadow-md">
                  <p className="text-sm font-medium text-gray-900">Now</p>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar size={16} />
                  <span>Adopted in {story.date}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {story.petName} & {story.adopter}
                </h2>
                
                <p className="text-gray-600 mb-6">
                  <Quote className="inline-block text-orange-500 mr-2" size={20} />
                  {story.story}
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={story.beforeImage}
                    alt={`${story.petName} before adoption`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Before Adoption</p>
                    <p className="text-sm text-gray-500">{story.petType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-orange-500 text-white rounded-xl p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Write Your Own Success Story
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Start your adoption journey today and create your own heartwarming story.
          </p>
          <Link
            to="/pets"
            className="inline-flex items-center bg-white text-orange-500 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            <Heart className="mr-2" size={20} />
            Find Your Perfect Match
          </Link>
        </div>
      </div>

      {/* Share Your Story Section */}
      <div className="text-center">
        <p className="text-gray-600">
          Already adopted from us?{' '}
          <Link to="/contact" className="text-orange-500 hover:text-orange-600 font-medium">
            Share your success story
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SuccessStories; 