"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/lib/axios";

interface UserProfile {
  firstName: string;
  lastName:string;
  coverPhoto: string;
  profilePhoto: string;
  bio?: string;
  worksAt?: string;
  formerWork?: string;
  education?: string;
  location?: string;
  friendsCount: number;
}

interface UserProfileResponse {
  user: UserProfile;
}


export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get<UserProfileResponse>("/auth/profile") // replace with your env var
      .then((res) =>{
        console.log(res.data); setProfile(res.data.user)})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center mt-10">No profile data found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Cover Photo */}
      <div className="relative w-full h-60 md:h-72 lg:h-80 rounded-xl overflow-hidden shadow">
        <Image
          src={profile.profilePic || "/haha.jpg"}
          alt="Cover"
          fill
          className="object-cover"
        />
        <Button
          size="sm"
          className="absolute bottom-3 right-3 bg-white text-black hover:bg-gray-200"
        >
          Edit cover photo
        </Button>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 -mt-16 px-4">
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <Image
            src={profile.profilePic|| "/haha.jpg"}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col md:flex-row md:justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
            <p className="text-gray-600">{profile.friendsCount || 0} Orders</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Delivery Location
            </Button>
            <Button variant="outline">Edit profile</Button>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg mb-3">Details</h2>
          <ul className="space-y-2 text-gray-700">
            {profile.email && <li>📖 {profile.email}</li>}
            {profile.telephone && <li>💼 Telephone {profile.telephone }</li>}
            {!profile.formerWork && <li>🛠 Formerly at {profile.formerWork || "framework"}</li>}
            {!profile.education && <li>🎓 Studied at {profile.education || "Kigali"}</li>}
            {!profile.location && <li>📍 Lives in {profile.location || "Rwanda"}</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
