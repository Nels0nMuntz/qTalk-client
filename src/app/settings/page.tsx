import React from 'react';
import { Metadata } from 'next';
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import SettingsForm from "@/components/settings/SettingsForm";

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage account and website settings.',
};

export default async function Page() {
  const session = await getAuthSession()
  if(!session?.user) {
    redirect('/sign-in')
  }
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>

        <div className="grid gap-10">
          <SettingsForm
            user={{
              id: session.user.id,
              username: session.user.username || '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
