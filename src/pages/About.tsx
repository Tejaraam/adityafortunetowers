import { motion } from 'framer-motion';
import { MapPin, Car, Activity, Compass, BookOpen, Users } from 'lucide-react';

const timelineData = [
  { year: '2018', title: 'Tower Completed', description: 'Construction completed and the first set of families moved into the community.' },
  { year: '2019', title: 'First AGM', description: 'The first Annual General Meeting was held, forming the initial executive committee.' },
  { year: '2020', title: 'Community Festival', description: 'Celebrated our first major community-wide festival with overwhelming participation.' },
  { year: '2021', title: 'Renovation', description: 'Upgraded the clubhouse and enhanced the landscaping around the main entrance.' }
];

export default function About() {
  return (
    <div className="flex flex-col min-h-screen relative z-0">
      <div className="fixed inset-0 bg-[url('/images/about_building.jpg')] bg-cover bg-center bg-no-repeat -z-20"></div>
      <div className="fixed inset-0 bg-gray-100/90 backdrop-blur-sm -z-10"></div>
      {/* Hero Header */}
      <div className="bg-primary py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/about_building.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 bg-primary/40 py-10 rounded-2xl mx-4 shadow-lg backdrop-blur-sm">
          <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-6 drop-shadow-lg">About Aditya Fortune Towers</h1>
          <div className="w-20 h-2 bg-accent mx-auto rounded-full mb-8"></div>
          <p className="text-gray-100 text-xl font-medium max-w-3xl mx-auto px-4 leading-relaxed drop-shadow">
            Vizag is a beautiful place with the most promising future and Madhurawada is the most upcoming premium location in Vizag. Aditya Fortune Towers is a super luxury apartment project of the kinds Vizag has probably not seen before.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        {/* Timeline Section */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-black text-primary mb-6">Our Journey</h2>
            <div className="w-20 h-2 bg-accent mx-auto rounded-full"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
            
            <div className="space-y-12">
              {timelineData.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="md:w-1/2"></div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-accent border-4 border-white shadow-sm z-10 hidden md:block"></div>
                  
                  <div className={`md:w-1/2 p-6 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                    <div className="bg-white p-10 rounded-2xl shadow-md border-2 border-gray-200 relative hover:border-accent transition-colors">
                      {/* Mobile dot */}
                      <div className="md:hidden absolute top-0 left-8 transform -translate-y-1/2 bg-accent text-white px-4 py-2 rounded-full text-base font-bold shadow-sm">
                        {item.year}
                      </div>
                      <span className="hidden md:block text-6xl font-heading font-black text-gray-100 absolute top-4 right-8 z-0">
                        {item.year}
                      </span>
                      <div className="relative z-10 mt-4 md:mt-0">
                        <h3 className="text-2xl font-black text-primary mb-3">{item.title}</h3>
                        <p className="text-gray-700 text-lg leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities & Infrastructure */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-black text-primary mb-6">Infrastructure & Facilities</h2>
            <div className="w-20 h-2 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Prime Location', desc: 'Located in Midhilapuri Vuda Colony, Madhurawada with excellent connectivity.' },
              { icon: Car, title: 'Multi-Level Parking', desc: '3-Level parking system with two car parking bays per apartment.' },
              { icon: Activity, title: 'Health & Fitness', desc: 'Fully equipped air-conditioned gymnasium for all your fitness needs.' },
              { icon: Compass, title: 'Vaastu Compliant', desc: 'Thoughtfully designed 100% Vaastu compliant spacious layouts.' },
              { icon: BookOpen, title: 'Recreation Hub', desc: 'Dedicated leisure room, library, and indoor table tennis room.' },
              { icon: Users, title: 'Community & Leisure', desc: 'Premium community hall, club house, and a luxurious swimming pool.' },
            ].map((facility, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-md border-2 border-gray-200 hover:shadow-lg hover:border-accent transition-all text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 mx-auto">
                  <facility.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{facility.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{facility.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Location Map */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-black text-primary mb-6">Location Map</h2>
            <div className="w-20 h-2 bg-accent mx-auto rounded-full"></div>
            <p className="text-gray-700 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              Conveniently located in Madhurawada, offering excellent connectivity to the rest of Visakhapatnam.
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.156843460662!2d83.3652439!3d17.8037653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a395ba5676b6fcd%3A0xf200e6af58c1f5af!2sAditya%20Fortune%20Towers!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin" 
              className="w-full h-[500px] rounded-2xl" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
}
