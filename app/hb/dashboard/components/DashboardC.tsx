'use client';

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
// import styles from 'renderer/style';
// import { checkIcon, historyIcon , visibilityIcon, loadingIcon, checkColoredIcon} from '../../../assets'
import { CheckCircleIcon, HistoryIcon, EyeIcon, LoaderIcon } from 'lucide-react';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
Tabs,
TabsContent,
TabsList,
TabsTrigger,
} from '@radix-ui/react-tabs';
import TaskPage from './HistoricPage';
import { Database } from '@/types_db';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

  
type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  session: Session | null;
  user: User | null | undefined;
  subscription: SubscriptionWithProduct | null;
}
  
export default function DashboardC({
session,
user,
subscription
}: Props) {    

type HistoricType = {
    id: string,
    date: string,
    channel_page: string,
    vidname_caption: string,
    status: string,
}
type processInfosType = {
    init: boolean,
    lists: {
    done: number,
    total: number
    },
    compiles: {
    done: number,
    total: number
    },
    uploads: {
    done: number,
    total: number
    },
}
const formRef = useRef<HTMLFormElement>(null)
const [appStarted, setAppStarted] = useState<boolean>(false);
const [validCode, setValidCode] = useState<boolean>(false);
const [code, setCode] = useState<string>('');
const [oldCode, setOldCode] = useState<string>('');
const [handleCode, setHandleCode] = useState<string>('');
const [success, setSuccess] = useState(0);
const [historic, setHistoric] = useState([]);
const [processInfos, setProcessInfos] = useState<processInfosType>({
    init: false,
    lists: {
    done: 0,
    total: 0
    },
    compiles: {
    done: 0,
    total: 0
    },
    uploads: {
    done: 0,
    total: 0
    },
})

const subscriptionPrice =
subscription &&
new Intl.NumberFormat('en-US', {
style: 'currency',
currency: subscription?.prices?.currency!,
minimumFractionDigits: 0
}).format((subscription?.prices?.unit_amount || 0) / 100);

const changeHandler = (
    event:
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLSelectElement>
    | string
) => {
    setCode(String(event.currentTarget.value.trim()));
};

useEffect(() => {
    if (window.electron) {
        
        window.electron.handleDashboard('ipc-example-2').then(result => setHistoric(result)).catch(error => console.log(error))
        let x = 0
        historic.forEach((item: HistoricType) => {
    if (item.status === "Success") {
        x += 1
        }
    })
    setSuccess(x)
    window.electron.handleBot.codeHandle('codeHandle', async(data:any) => {
    if (data === "need code") {
        setValidCode(true)
        setHandleCode('')
    } else if (data === 'correct') {
        setHandleCode("Good")
        setValidCode(false)
    } else if (data === 'incorrect') {
        setHandleCode("Retry")
    }
});
window.electron.handleBot.processInfos('processInfos', async(data:any) => {
    if (data === 'ic') {
        setProcessInfos({...processInfos, init: true});
        console.log(processInfos);
        console.log(data);
    } else if (data.includes('nbl')) {
        setProcessInfos({...processInfos, lists: {...processInfos.lists, total: data.split(':')[1]}});
    } else if (data === 'l+1') {
        setProcessInfos({...processInfos, lists: {...processInfos.lists, done: processInfos.lists.done + 1}});
    } else if (data.includes('nbc') === 'nbc') {
        setProcessInfos({...processInfos, compiles: {...processInfos.compiles, total: data.split(':')[1]}});
    } else if (data === 'c+1') {
        setProcessInfos({...processInfos, lists: {...processInfos.compiles, done: processInfos.compiles.done + 1}});
    } else if (data.includes('nbu') === 'nbu') {
        setProcessInfos({...processInfos, uploads: {...processInfos.uploads, total: data.split(':')[1]}});
    } else if (data === 'u+1') {
        setProcessInfos({...processInfos, uploads: {...processInfos.uploads, done: processInfos.uploads.done + 1}});
    } else if (data === 'al') {
        setAppStarted(true);
        console.log(data);
    } else if (data === 'af') {
        setAppStarted(false);
        setProcessInfos({...processInfos, init: false});
    }
});
}
}, [])

return (
    <div className='min-w-[100%] h-screen max-h-screen relative flex flex-row overflow-hidden'>
        <div className="flex-col flex w-full">
            <div className="flex-1 space-y-4 p-8 pt-6 w-full max-h-[100vh]">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
                <Tabs defaultValue="overview" className="space-y-4 w-[100%]">
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium mr-52">
                                Version
                                </CardTitle>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                                >
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Up to date</div>
                                <p className="text-xs text-muted-foreground">
                                v1.0.0
                                </p>
                            </CardContent>
                            </Card>
                            <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                Subscription
                                </CardTitle>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                                >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {subscription && new Date(subscription?.current_period_end).getTime() > new Date().getTime() ? (
                                        `Standard Plan (${subscriptionPrice}/${subscription?.prices?.interval})`
                                    ) : (
                                        <Link href="/#pricing"><span className='underline'>Choose your plan</span></Link>
                                    )}
                                </div>
                                <p className={`${subscription && new Date(subscription?.current_period_end).getTime() > new Date().getTime() ? 'text-green-500' : 'text-red-600'} text-xs text-muted-foreground`}>
                                    {subscription && new Date(subscription?.current_period_end).getTime() > new Date().getTime() ? `Active until ${subscription?.current_period_end}` : `Inactive since ${subscription?.current_period_end}`}
                                </p>
                            </CardContent>
                            </Card>
                            <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Uploads</CardTitle>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                                >
                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                <path d="M2 10h20" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">197</div>
                                <p className="text-xs text-muted-foreground">
                                124 / 60 / 03
                                </p>
                            </CardContent>
                            </Card>
                            <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                Active Now
                                </CardTitle>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                                >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+573</div>
                                <p className="text-xs text-muted-foreground">
                                +201 since last hour
                                </p>
                            </CardContent>
                            </Card>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-5 max-h-[calc(100vh-250px)] overflow-y-auto">
                                <CardHeader>
                                    <CardTitle>Recent Activities</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <TaskPage />
                                </CardContent>
                            </Card>

                            <Card className="col-span-2 sticky top-0">
                                <CardHeader>
                                    <CardTitle>Run it</CardTitle>
                                    <CardDescription>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className=''>
                                    <div className='flex flex-col'>                    
                                        <div className="mb-10">
                                            <Card>
                                            <CardHeader>
                                                <CardTitle>Overview</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="bg-primary mx-auto">
                                                <div className={`flex flex-row items-center py-2 border-b-[1px] border-neutral-600`}>
                                                    <p className={`${appStarted ? "text-white" : "text-gray-600"}`}>Initializing{processInfos.init ? "" : "..."}</p>{processInfos.init ? <CheckCircleIcon className='w-[20px] h-[20px] ml-4' /> : <LoaderIcon className={`${appStarted ? "text-white" : "text-gray-600"} loader w-[20px] h-[20px] ml-4`} />}
                                                </div>
                                                <div className={`flex flex-row items-center py-2 border-b-[1px] border-neutral-600`}>
                                                    <p className={`${appStarted ? "textwhited" : "text-gray-600"}`}>Downloading ({processInfos.lists.done}/{processInfos.lists.total})</p>{processInfos.lists.done === processInfos.lists.total ? <CheckCircleIcon className={`${appStarted ? "text-white" : "text-gray-600"} loader w-[20px] h-[20px] ml-4`} /> : <LoaderIcon className={`${appStarted ? "text-white" : "text-gray-600"} loader w-[20px] h-[20px] ml-4`} />}
                                                </div>
                                                <div className={`flex flex-row items-center py-2 border-b-[1px] border-neutral-600`}>
                                                    <p className={`${appStarted ? "text-white" : "text-gray-600"}`}>Compiling ({processInfos.compiles.done}/{processInfos.compiles.total})</p>{processInfos.compiles.done === processInfos.compiles.total ? <CheckCircleIcon className={`${appStarted ? "text-white" : "text-gray-600"} loader w-[20px] h-[20px] ml-4`} /> : <LoaderIcon className={`${appStarted ? "text-white" : "text-gray-600"} loader w-[20px] h-[20px] ml-4`} />}
                                                </div>
                                                <div className={`flex flex-row items-center py-2 border-b-[1px] border-neutral-600`}>
                                                    <p className={`${appStarted ? "text-white" : "text-gray-600"}`}>Uploading ({processInfos.uploads.done}/{processInfos.uploads.total})</p>{processInfos.uploads.done === processInfos.uploads.total ? <CheckCircleIcon className={`${appStarted ? "text-white" : "text-gray-600"} loader w-[20px] h-[20px] ml-4`} /> : <LoaderIcon className={`${appStarted ? "text-white" : "text-gray-600"} loader w-[20px] h-[20px] ml-4`} />}
                                                </div>
                                                </div>
                                            </CardContent>
                                            </Card>
                                        </div>

                                        <div className='flex flex-col'>
                                            <Button
                                                className='mb-5'
                                                onClick={() => {
                                                    if (appStarted) {
                                                    window.electron.handleBot.stopBot('stopBot');
                                                    } else {
                                                    window.electron.handleBot.runBot('runBot');
                                                    }
                                                }}
                                            >
                                            Queue
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    if (appStarted) {
                                                        window.electron.handleBot.stopBot('stopBot');
                                                    } else {
                                                        window.electron.handleBot.runBot('runBot');
                                                    }
                                                    }}
                                            >
                                            One Shot
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </div>
)
}
