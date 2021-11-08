/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-plusplus */

import React, { useEffect, useState } from 'react';

const urlB64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (Notification.permission !== 'granted') {
      return Notification.requestPermission();
    }
    return Notification.permission;
  };

const subscribeToNotification = async (): Promise<
  PushSubscription | undefined
> => {
  const serviceWorker = await navigator.serviceWorker.ready;

  const applicationServerKey = urlB64ToUint8Array(
    'BKG8GSJRi8ffkM-pzAptAXtCfrFIFikdLdgWPSrITDftPYJmvTXunyTd66e6LXwtj5SfP_aEPnb8IATFiFotEKE'
  );
  const pushURL = await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });
  return pushURL;
};

const useNotification = () => {
  const [notificationPermission, setNotificationPermitted] =
    useState<NotificationPermission>();

  useEffect(() => {
    const setNotification = async () => {
      const permission = await requestNotificationPermission();
      setNotificationPermitted(permission);
    };
    void setNotification();
  }, [notificationPermission]);

  return { notificationPermission, subscribeToNotification };
};

export default useNotification;
