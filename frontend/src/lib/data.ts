import { Doctor, Hospital, HOSPITAL_TYPE, COST_RANGE } from "@/types";

const mockHospitals: Hospital[] = [
  {
    id: 1,
    name: "City General Hospital",
    phoneNumber: "555-0123",
    website: "https://www.citygeneral.com",
    types: [HOSPITAL_TYPE.PUBLIC, HOSPITAL_TYPE.GENERAL],
    icus: 15,
    costRange: COST_RANGE.MODERATE,
    latitude: 23.723081,
    longitude: 90.409136,
    locationResponse: {
      id: 1,
      locationType: "HOSPITAL",
      address: "123 Healthcare Ave, Dhanmondi",
      thana: "Dhanmondi",
      po: "Dhanmondi",
      city: "Dhaka",
      postalCode: 1205,
      zoneId: 1
    }
  },
  {
    id: 2,
    name: "Private Care Center",
    phoneNumber: "555-0456",
    website: "https://www.privatecare.com",
    types: [HOSPITAL_TYPE.PRIVATE, HOSPITAL_TYPE.SPECIALIZED],
    icus: 10,
    costRange: COST_RANGE.HIGH,
    latitude: 23.751315,
    longitude: 90.367692,
    locationResponse: {
      id: 2,
      locationType: "HOSPITAL",
      address: "456 Medical Drive, Gulshan",
      thana: "Gulshan",
      po: "Gulshan",
      city: "Dhaka",
      postalCode: 1212,
      zoneId: 1
    }
  },
  {
    id: 3,
    name: "Community Health Center",
    phoneNumber: "555-0789",
    website: "https://www.communityhealth.com",
    types: [HOSPITAL_TYPE.PUBLIC, HOSPITAL_TYPE.GENERAL],
    icus: 8,
    costRange: COST_RANGE.LOW,
    latitude: 23.773081,
    longitude: 90.709136,
    locationResponse: {
      id: 3,
      locationType: "HOSPITAL",
      address: "789 Wellness Street, Mirpur",
      thana: "Mirpur",
      po: "Mirpur",
      city: "Dhaka",
      postalCode: 1216,
      zoneId: 1
    }
  },
  {
    id: 4,
    name: "Advanced Medical Institute",
    phoneNumber: "555-0321",
    website: "https://www.advancedmedical.com",
    types: [HOSPITAL_TYPE.PRIVATE, HOSPITAL_TYPE.RESEARCH],
    icus: 20,
    costRange: COST_RANGE.VERY_HIGH,
    latitude: 23.823081,
    longitude: 90.809136,
    locationResponse: {
      id: 4,
      locationType: "HOSPITAL",
      address: "321 Innovation Road, Uttara",
      thana: "Uttara",
      po: "Uttara",
      city: "Dhaka",
      postalCode: 1230,
      zoneId: 1
    }
  },
  {
    id: 5,
    name: "Rural Healthcare Clinic",
    phoneNumber: "555-0654",
    website: "https://www.ruralhealth.com",
    types: [HOSPITAL_TYPE.PUBLIC, HOSPITAL_TYPE.GENERAL],
    icus: 5,
    costRange: COST_RANGE.VERY_LOW,
    latitude: 23.323081,
    longitude: 90.309136,
    locationResponse: {
      id: 5,
      locationType: "HOSPITAL",
      address: "654 Village Lane, Savar",
      thana: "Savar",
      po: "Savar",
      city: "Dhaka",
      postalCode: 1340,
      zoneId: 2
    }
  },
  {
    id: 6,
    name: "Specialized Surgery Center",
    phoneNumber: "555-0987",
    website: "https://www.specializedsurgery.com",
    types: [HOSPITAL_TYPE.PRIVATE, HOSPITAL_TYPE.SPECIALIZED],
    icus: 12,
    costRange: COST_RANGE.HIGH,
    latitude: 23.793081,
    longitude: 90.409136,
    locationResponse: {
      id: 6,
      locationType: "HOSPITAL",
      address: "987 Operation Blvd, Banani",
      thana: "Banani",
      po: "Banani",
      city: "Dhaka",
      postalCode: 1213,
      zoneId: 1
    }
  },
  {
    id: 7,
    name: "Women & Children Hospital",
    phoneNumber: "555-0147",
    website: "https://www.womenchildren.com",
    types: [HOSPITAL_TYPE.MATERNITY, HOSPITAL_TYPE.CHILDREN],
    icus: 6,
    costRange: COST_RANGE.MODERATE,
    latitude: 23.763081,
    longitude: 90.359136,
    locationResponse: {
      id: 7,
      locationType: "HOSPITAL",
      address: "147 Family Care Way, Mohammadpur",
      thana: "Mohammadpur",
      po: "Mohammadpur",
      city: "Dhaka",
      postalCode: 1207,
      zoneId: 1
    }
  },
  {
    id: 8,
    name: "Emergency Trauma Center",
    phoneNumber: "555-0258",
    website: "https://www.emergencytrauma.com",
    types: [HOSPITAL_TYPE.PUBLIC, HOSPITAL_TYPE.GENERAL],
    icus: 25,
    costRange: COST_RANGE.LOW,
    latitude: 23.753081,
    longitude: 90.459136,
    locationResponse: {
      id: 8,
      locationType: "HOSPITAL",
      address: "258 Emergency Street, Tejgaon",
      thana: "Tejgaon",
      po: "Tejgaon",
      city: "Dhaka",
      postalCode: 1208,
      zoneId: 1
    }
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
    name: "Dr. Michael Brown",
    specialty: "Pediatrics",
    phone_number: "555-3333",
    email: "michael.brown@hospital.com"
  },
  {
    id: 4,
    name: "Dr. Emily Davis",
    specialty: "Gynecology",
    phone_number: "555-4444",
    email: "emily.davis@hospital.com"
  },
  {
    id: 5,
    name: "Dr. Robert Wilson",
    specialty: "Surgery",
    phone_number: "555-5555",
    email: "robert.wilson@hospital.com"
  }
];

export { mockHospitals, mockDoctors };
