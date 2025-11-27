'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, Eye, Heart, MessageCircle, Video, BarChart3 } from 'lucide-react';

export default function Dashboard() {
    // Mock data - in production, fetch from Firebase
    const stats = {
        followers: 12543,
        following: 432,
        totalPosts: 156,
        totalViews: 1234567,
        totalLikes: 45678,
        totalComments: 3456,
        engagementRate: 4.2,
    };

    const recentPosts = [
        { id: '1', title: 'Amazing sunset', views: 12345, likes: 567, comments: 89, type: 'photo' },
        { id: '2', title: 'Travel vlog', views: 45678, likes: 1234, comments: 234, type: 'video' },
        { id: '3', title: 'Cooking tutorial', views: 23456, likes: 789, comments: 123, type: 'reel' },
    ];

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.followers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-500">+12%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-500">+8%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.engagementRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-500">+0.5%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPosts}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-500">+5</span> this month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Posts Performance */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Posts</CardTitle>
                    <CardDescription>Performance of your latest content</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentPosts.map((post) => (
                            <div
                                key={post.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                                        <Video className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{post.title}</p>
                                        <p className="text-sm text-muted-foreground capitalize">{post.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                        <span>{post.views.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Heart className="h-4 w-4 text-muted-foreground" />
                                        <span>{post.likes.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                        <span>{post.comments}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Analytics Tabs */}
            <Card>
                <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>Detailed insights into your content performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="audience">Audience</TabsTrigger>
                            <TabsTrigger value="content">Content</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="space-y-4 pt-4">
                            <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/30">
                                <p className="text-muted-foreground">Chart placeholder - Overview metrics</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="audience" className="space-y-4 pt-4">
                            <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/30">
                                <p className="text-muted-foreground">Chart placeholder - Audience demographics</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="content" className="space-y-4 pt-4">
                            <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/30">
                                <p className="text-muted-foreground">Chart placeholder - Content performance</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
