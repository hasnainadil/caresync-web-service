import { Doctor, Hospital } from "@/types";

const mockHospitals: Hospital[] = [
  {
    id: 1,
    name: "City General Hospital",
    address: "123 Healthcare Ave, Dhanmondi",
    phone_number: "555-0123",
    website: "https://www.citygeneral.com",
    location: "Dhaka",
    type: "public",
    icus: 15,
    rating: 4.5,
    latitude: 23.723081,
    longitude: 90.409136,
    specialties: ["Cardiology", "Neurology", "Emergency Medicine", "Pediatrics"],
    isOpen: true,
    description: "A leading public hospital providing comprehensive healthcare services to the community.",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400"
  },
  {
    id: 2,
    name: "Private Care Center",
    address: "456 Medical Drive, Gulshan",
    phone_number: "555-0456",
    website: "https://www.privatecare.com",
    location: "Dhaka",
    type: "private",
    icus: 10,
    rating: 4.8,
    latitude: 23.751315,
    longitude: 90.367692,
    specialties: ["Orthopedics", "Dermatology", "Plastic Surgery", "Dental Care"],
    isOpen: true,
    description: "Premium private healthcare facility with state-of-the-art medical equipment.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
  },
  {
    id: 3,
    name: "Community Health Center",
    address: "789 Wellness Street, Mirpur",
    phone_number: "555-0789",
    website: "https://www.communityhealth.com",
    location: "Dhaka",
    type: "public",
    icus: 8,
    rating: 4.2,
    latitude: 23.773081,
    longitude: 90.709136,
    specialties: ["Family Medicine", "Gynecology", "Internal Medicine", "Psychiatry"],
    isOpen: false,
    description: "Community-focused healthcare center serving the local population.",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400"
  },
  {
    id: 4,
    name: "Advanced Medical Institute",
    address: "321 Innovation Road, Uttara",
    phone_number: "555-0321",
    website: "https://www.advancedmedical.com",
    location: "Dhaka",
    type: "private",
    icus: 20,
    rating: 4.9,
    latitude: 23.823081,
    longitude: 90.809136,
    specialties: ["Oncology", "Cardiovascular Surgery", "Transplant", "Research"],
    isOpen: true,
    description: "Cutting-edge medical institute specializing in advanced treatments and research.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
  },
  {
    id: 5,
    name: "Rural Healthcare Clinic",
    address: "654 Village Lane, Savar",
    phone_number: "555-0654",
    website: "https://www.ruralhealth.com",
    location: "Dhaka",
    type: "public",
    icus: 5,
    rating: 3.8,
    latitude: 23.323081,
    longitude: 90.309136,
    specialties: ["Primary Care", "Maternal Health", "Vaccination", "Emergency Care"],
    isOpen: true,
    description: "Essential healthcare services for rural communities.",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400"
  },
  {
    id: 6,
    name: "Specialized Surgery Center",
    address: "987 Operation Blvd, Banani",
    phone_number: "555-0987",
    website: "https://www.specializedsurgery.com",
    location: "Dhaka",
    type: "private",
    icus: 12,
    rating: 4.7,
    latitude: 23.793081,
    longitude: 90.409136,
    specialties: ["General Surgery", "Laparoscopic Surgery", "Minimally Invasive", "Recovery Care"],
    isOpen: true,
    description: "Specialized surgical center with advanced operating facilities.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
  },
  {
    id: 7,
    name: "Women & Children Hospital",
    address: "147 Family Care Way, Mohammadpur",
    phone_number: "555-0147",
    website: "https://www.womenchildren.com",
    location: "Dhaka",
    type: "public",
    icus: 6,
    rating: 4.4,
    latitude: 23.763081,
    longitude: 90.359136,
    specialties: ["Obstetrics", "Gynecology", "Pediatrics", "Neonatal Care"],
    isOpen: true,
    description: "Dedicated healthcare facility for women and children's health.",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400"
  },
  {
    id: 8,
    name: "Emergency Trauma Center",
    address: "258 Emergency Street, Tejgaon",
    phone_number: "555-0258",
    website: "https://www.emergencytrauma.com",
    location: "Dhaka",
    type: "public",
    icus: 25,
    rating: 4.6,
    latitude: 23.753081,
    longitude: 90.459136,
    specialties: ["Emergency Medicine", "Trauma Surgery", "Critical Care", "Ambulance Services"],
    isOpen: true,
    description: "24/7 emergency and trauma care center with rapid response capabilities.",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400"
  }
];

const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. John Smith",
    specialty: "Cardiology",
    phone_number: "555-1111",
    email: "john.smith@hospital.com"
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    specialty: "Neurology",
    phone_number: "555-2222",
    email: "sarah.johnson@hospital.com"
  },
  {
    id: 3,
    name: "Dr. John Smith",
    specialty: "Cardiology",
    phone_number: "555-1111",
    email: "john.smith@hospital.com"
  }
];

export { mockHospitals, mockDoctors };