export const BACKEND_URL = process.env.NODE_ENV === "production" 
  ? window.location.origin 
  : "http://localhost:5000";
