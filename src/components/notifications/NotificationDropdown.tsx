'use client'

import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export default function NotificationDropdown() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (session?.user) {
      fetchNotifications()
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      setNotifications(data)
      setUnreadCount(data.filter((n: Notification) => !n.read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      })
      fetchNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case 'message':
        return `/messages?notificationId=${notification.id}`
      case 'listing_sold':
        return `/listings/${notification.id}`
      case 'review':
        return `/profile?notificationId=${notification.id}`
      default:
        return '#'
    }
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="relative inline-flex items-center p-2 text-gray-400 hover:text-gray-500 focus:outline-none">
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {notifications.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <Menu.Item key={notification.id}>
                  {({ active }) => (
                    <Link
                      href={getNotificationLink(notification)}
                      onClick={() => markAsRead(notification.id)}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } ${
                        !notification.read ? 'bg-blue-50' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                    >
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-gray-500">{notification.message}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </Link>
                  )}
                </Menu.Item>
              ))
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 