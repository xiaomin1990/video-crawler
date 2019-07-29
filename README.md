# video-crawler

视频爬虫

## QuickStart


### Development


### Deploy

### 开发技术栈

- 工具
    手机、charles
- 软件包
    nodejs、ffmpeg、redis、mongo、
    ffmpeg: http://ffmpeg.org

    


### 说明

平台|类型|工具|VPN|水印|详细说明
--|:--:|--:|--:|--:|--:
哔哩哔哩|web|自动抓取|否|有|能抓取数据包括：首页数据、根据类别（动画、潘剧、游戏、科技等）抓取数据、根据账号抓取数据。3.抓取的数据包括：视频文件、播放量、评论数、视频封面。
抖音|app|手动抓取、手机、charles|否|无|能抓取首页热门数据、关键字搜索数据、个人视频数据。3.抓取的数据包括：视频文件、点赞量、评论数、转发量、视频封面、视频动态封面。能按照城市获取抖音美食推荐视频和商店。商店数据包括名字、地点、营业时间、排名、菜品图片等。视频的特点关于这些美食。能获取推荐的热门景点、文化、玩乐、酒店、购物、运动的视频。
微视|web|自动抓取|否|有|只能抓取个人账号的前15个视频。
Instagram|web|自动抓取|是|无|能抓取数据包括：首页数据、根据类别抓取数据、根据关键字抓取数据、根据账号抓取数据。抓取的数据包括：视频文件、播放量、评论数、视频封面。
小红书|app|手动抓取、手机、charles|否|无|能抓取数据包括：首页数据、根据类别抓取数据、根据关键字抓取数据、根据账号抓取数据。抓取的数据包括：视频文件、播放量、评论数、视频封面。
穷游|app|自动抓取|否|无|能抓取数据包括：首页数据、热门数据、根据类别抓取数据、根据关键字抓取数据、根据账号抓取数据。抓取的数据包括：视频文件、播放量、评论数、视频封面。
飞猪|app|未知|未知|未知|暂时还不能获取到任何数据

### 数据爬虫流程

- 哔哩哔哩
    1. ```
        let url=`https://api.bilibili.com/x/web-interface/search/type?search_type=video&highlight=1&keyword=${encodeURIComponent(keyword)}&page=${page}&            jsonp=jsonp&callback=`
        const option = {
            headers: {
                Referer: `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`,
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'
            }
        }

        得到数据
        {
            "page":1,
            "pagesize":20,
            "numResults":8,
            "numPages":1,
            "result":[{
                "pubdate":1548745164,
                "tag":"WayV,NCT,翻唱,Regular,理所当然,音乐,COVER,中文翻唱",
                "duration":"3:58",
                "id":42033020,
                "title":"【Way_<em class="keyword">Empathy</em>翻唱】震惊!威神V听了以后都不淡定了!",
                "type":"video",
                "play":524,
                "pic":"//i1.hdslb.com/bfs/archive/bf53cfbac0da3103122cc27a7d00b8eed0c177c5.jpg",
                "description":"作品类型：原曲翻唱",
                "favorites":8,  //点赞
                "arcurl":"http://www.bilibili.com/video/av42033020",
                "author":"WayV_Empathy共感站",
                "typename":"翻唱"
            }]
        }

        ```
    2. 爬取第一步得到的“arcurl”页面，获取视频文件和音频文件。注意：开启gzip压缩选项。
    3. 下载视频和音频文件并使用ffmpeg工具合成视频。
    4. 使用ffmpeg工具，将视频转换为m3u8格式。
    5. 上传视频文件到腾讯云COS

- 抖音
    1. 手机连接charles代理网络，在APP内搜索账号数据。charles工具自动保存https请求(https://aweme.snssdk.com/aweme/v1/search/item/)结果到文件。
    2. 监听文件变化，获取http接口返回数据并将数据push到Reids的channel中。 {host:"api.amemv.com",path:"/aweme/v1/search/item/",query:"*"}
    3. 订阅Redis channel 获取json 数据  取出 play_addr = obj.video.bit_rate[1]

       ```
       {
            "aweme_id":"6641725683896683780",  //视频ID
            "desc":"#你开车的样子真好看 方向盘被锁？别着急，一秒搞定！@抖音汽车 @祝晓晗",
            "create_time":1546397266,
            "author":{
                "uid":"56284938462",
                "short_id":"1312241326",
                "nickname":"老丈人说车",
                "gender":1,
                "signature":"蠢萌闺女和操心老爸的学车故事，专业中还有点暖。Q：2475548185（合作）",
                "avatar_larger":{
                    "uri":"b6ce000d45a2d62d565f",
                    "url_list":[
                        "https://p3-dy.byteimg.com/aweme/1080x1080/b6ce000d45a2d62d565f.jpeg",
                        "https://p9-dy.byteimg.com/aweme/1080x1080/b6ce000d45a2d62d565f.jpeg",
                        "https://p1-dy.byteimg.com/aweme/1080x1080/b6ce000d45a2d62d565f.jpeg"
                    ],
                    "width":720,
                    "height":720
                },
            },
            "music":{
                "id":6641725696769002000,
                "play_url":{
                    "uri":"http://p1-dy.byteimg.com/obj/ies-music/1621515062504455.mp3",
                    "url_list":[
                        "http://p1-dy.byteimg.com/obj/ies-music/1621515062504455.mp3"
                    ],
                    "width":720,
                    "height":720
                }
            },
            "cha_list":[
                {
                    "cid":"1620448208715779",
                    "cha_name":"你开车的样子真好看",
                    "desc":"据说在女人眼中，男人最帅的瞬间是开车！你没听错，不是壁咚墙咚摸头杀，而是开车，参与挑战#你开车的样子真好看#记录下你开车的精彩瞬间！视频@抖音汽车（抖音号：DYcar）同时私信你的视频会有惊喜哦～～"
                    },
                }
            ],
            "video":{
                  "bit_rate":[
                    {
                        "gear_name":"normal_540",
                        "quality_type":20,
                        "bit_rate":1652981,
                        "play_addr":{
                            "uri":"v0300f220000bhvqmd5muq8vk6dml57g",
                            "url_list":[
                                "http://v3-dy-n.ixigua.com/8197bf2af522e7b251db602ded2fab7a/5d316e15/video/m/22041e46ac3dfc345cd89807f4ad9c3640011619741a00006cb561dbe8c8/?rc=ajhwOXl0cGd0azMzNWkzM0ApQHRAbzhFODw1NjU0NDk4Nzw6PDNAKXUpQGczdSlAZjV2KUBmcHcxZnNoaGRmOzRANGlhaDVyMmpzXy0tLy0wc3M1byNvIzYuNS81LTItLS8uLi4tLi9pOmIwcCM6YS1xIzpgMG8jYmZoXitqdDojLy5e",
                                "http://v3-dy.ixigua.com/8197bf2af522e7b251db602ded2fab7a/5d316e15/video/m/22041e46ac3dfc345cd89807f4ad9c3640011619741a00006cb561dbe8c8/",
                                "https://aweme.snssdk.com/aweme/v1/play/?video_id=v0300f220000bhvqmd5muq8vk6dml57g&line=0&ratio=540p&media_type=4&vr_type=0&improve_bitrate=0&is_play_url=1&h265=1",
                                "https://api.amemv.com/aweme/v1/play/?video_id=v0300f220000bhvqmd5muq8vk6dml57g&line=1&ratio=540p&media_type=4&vr_type=0&improve_bitrate=0&is_play_url=1&h265=1"
                            ],
                            "width":720,
                            "height":720,
                            "url_key":"v0300f220000bhvqmd5muq8vk6dml57g_h265_540p_1652981"
                        }
                    }
                ],
                "duration":50370
            }
        }
           
       ```
       4. 下载视频文件
    
    - 微视
    - Instagram 
        1. 需要使用vpn翻墙，使用vpn之后无法连接上国内的服务器。所以会先将数据保存在本地，断开VPN后再同步到服务器。
        2. 爬取页面获取列表和页面信息 https://www.instagram.com/${username}/
        ```
        {
            "entry_data":{
                "ProfilePage":[
                    {
                        "graphql":{
                            "user":{
                                "biography":"Check out my latest Scrambled: Peru in the link ⬇️ and head to my YouTube weekly to see some of my amazing egg dishes from #Uncharted !",
                                "profile_pic_url_hd":"https://scontent-hkg3-1.cdninstagram.com/vp/cc02d0ab14c568dee136e616cf9e58b4/5DAD5684/t51.2885-19/s320x320/26429265_1801356139896204_7973709430447407104_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com,
                                "edge_owner_to_timeline_media":{
                                "count":3500,
                                "page_info":{
                                    "has_next_page":true,
                                    "end_cursor":"QVFDWThZYzUzbHR4Z2s1SGg1VGMtczg3ejlnd1M3TDMtcjNzcFZtME11WllxS2hzMm1kX2JqVVdwOGVLazRGbGRvWXdWcDhNT25rY1FLX3lmdU9Ka2pELQ=="
                                },
                                "edges":[
                                    {
                                    "node":{
                                        "__typename":"GraphImage",   // GraphVideo 注意不同的type
                                        "id":"2090843355365628626",
                                        "edge_media_to_caption":{
                                            "edges":[
                                                {
                                                    "node":{
                                                        "text":"Tonight.....we have the beef on @masterchefonfox at 8/7c ! It’s #bbq night !"
                                                    }
                                                }
                                            ]
                                        },
                                        "shortcode":"B0BjxueDCed",
                                        "edge_media_to_comment":{
                                            "count":202
                                        },
                                        "display_url":"https://scontent-hkg3-1.cdninstagram.com/vp/ae79de37b91c9f892c6b0c1f47ea5bb3/5DC9CA10/t51.2885-15/e35/s1080x1080/65830200_2335138573406739_3390406312065215915_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com",  //封面
                                        "edge_liked_by":{
                                            "count":40779
                                        },
                                        "owner":{
                                            "id":"192815961",
                                            "username":"gordongram"
                                        },
                                        "thumbnail_src":"https://scontent-hkg3-1.cdninstagram.com/vp/dff9e7a7ef6b637a0d40a16423c7a267/5DEE1917/t51.2885-15/sh0.08/e35/c124.0.1191.1191a/s640x640/65830200_2335138573406739_3390406312065215915_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com",
                                        "thumbnail_resources":[
                                            {
                                                "src":"https://scontent-hkg3-1.cdninstagram.com/vp/dff9e7a7ef6b637a0d40a16423c7a267/5DEE1917/t51.2885-15/sh0.08/e35/c124.0.1191.1191a/s640x640/65830200_2335138573406739_3390406312065215915_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com",
                                                "config_width":640,
                                                "config_height":640
                                            }
                                        ],
                                        "is_video":true,
                                        "video_view_count":520150
                                    }
                                }]
                                
                            }
                        }
                    }
                ]
               
            }
        }

        ```
        3. https://www.instagram.com/graphql/query/?query_hash=477b65a610463740ccdb83135b2014db&variables=%7B%22shortcode%22:%22B0BjxueDCed%22%7D 
           备注: variables=encodeURIComponent('{"shortcode":"B0BjxueDCed"}')  根据 shortcode获取视频下载地址等信息

           ```
                {
                    "data": {
                        "shortcode_media": {
                            "__typename": "GraphVideo",
                            "id": "2090109050855106461",
                            "shortcode": "B0BjxueDCed",
                            "dimensions": {
                                "height": 750,
                                "width": 750
                            },
                            "gating_info": null,
                            "media_preview": "ACoqjhXaDgKe/Iz+AqK4TjkBc+nI+vtSxHgjGe/P/wBb60kuditgbc4+vHOPWpN+hSJ44yaN2wZbJNO5zyO36etPV2UdOD3oJRGTsPPJ704XQ9P8/lQqmZtqjJJ7f5wBUv2Ed3XP0Jqib2H2kuJMt3DA/iDxSyzBUVBhsBuDzgsew7YA49DWYzHoOKashXpVXJLRfPBo7/59qiU5G6pC4C5xmokXF/gzWtkESAscMSfQcHt/npzUwkXHC8duKwTduxyxyPQ9K0Uu12j6CqJuULa1M7EsdqL1OOT7D3/lWibG1K7RuU/3ic/p0p9t0x2qGY9aB2M94/Jyj9j27g9CKa7K6/KCMdyaluv4fof51WTofp/WgXkRkU2nmm0CP//Z",
                            "display_url": "https://scontent-lhr3-1.cdninstagram.com/vp/6951d32b2b222de3b732f4927f85340c/5D342CB1/t51.2885-15/e35/65841750_359780361311211_232905302420259283_n.jpg?_nc_ht=scontent-lhr3-1.cdninstagram.com",
                            "display_resources": [
                                {
                                    "src": "https://scontent-lhr3-1.cdninstagram.com/vp/cceb5e7655b7d5516e34d3055611de3f/5D33AC02/t51.2885-15/sh0.08/e35/s640x640/65841750_359780361311211_232905302420259283_n.jpg?_nc_ht=scontent-lhr3-1.cdninstagram.com",
                                    "config_width": 640,
                                    "config_height": 640
                                },
                                {
                                    "src": "https://scontent-lhr3-1.cdninstagram.com/vp/6951d32b2b222de3b732f4927f85340c/5D342CB1/t51.2885-15/e35/65841750_359780361311211_232905302420259283_n.jpg?_nc_ht=scontent-lhr3-1.cdninstagram.com",
                                    "config_width": 750,
                                    "config_height": 750
                                },
                                {
                                    "src": "https://scontent-lhr3-1.cdninstagram.com/vp/6951d32b2b222de3b732f4927f85340c/5D342CB1/t51.2885-15/e35/65841750_359780361311211_232905302420259283_n.jpg?_nc_ht=scontent-lhr3-1.cdninstagram.com",
                                    "config_width": 1080,
                                    "config_height": 1080
                                }
                            ],
                            "dash_info": {
                                "is_dash_eligible": false,
                                "video_dash_manifest": null,
                                "number_of_qualities": 0
                            },
                            "video_url": "https://scontent.cdninstagram.com/vp/c75a0f47269b640b867b88131504c4f4/5D3443EF/t50.2886-16/67325147_2332551036830533_5203029753165813448_n.mp4?_nc_ht=scontent.cdninstagram.com",
                            "video_view_count": 521885,
                            "is_video": true,
                            "should_log_client_event": false,
                            "tracking_token": "eyJ2ZXJzaW9uIjo1LCJwYXlsb2FkIjp7ImlzX2FuYWx5dGljc190cmFja2VkIjp0cnVlLCJ1dWlkIjoiOWJhNWJhYjYxYjRiNDQyYTkyZGFkZDVjOTZjMDAwMDkyMDkwMTA5MDUwODU1MTA2NDYxIn0sInNpZ25hdHVyZSI6IiJ9",
                            "edge_media_to_tagged_user": {
                                "edges": []
                            },
                            "edge_media_to_caption": {
                                "edges": [
                                    {
                                        "node": {
                                            "text": "You’re invited to the wedding event that may end up a little raw on @masterchefonfox tonight at 8/7c ! Congrats @chefgerron Gx"
                                        }
                                    }
                                ]
                            },
                            "caption_is_edited": false,
                            "has_ranked_comments": false,
                            "edge_media_to_comment": {
                                "count": 423,
                                "page_info": {
                                    "has_next_page": true,
                                    "end_cursor": ""
                                },
                                "edges": []
                            },
                            "comments_disabled": false,
                            "taken_at_timestamp": 1563380628,
                            "edge_media_preview_like": {
                                "count": 61498,
                                "edges": []
                            },
                            "edge_media_to_sponsor_user": {
                                "edges": []
                            },
                            "location": null,
                            "viewer_has_liked": false,
                            "viewer_has_saved": false,
                            "viewer_has_saved_to_collection": false,
                            "viewer_in_photo_of_you": false,
                            "viewer_can_reshare": true,
                            "owner": {
                                "id": "192815961",
                                "is_verified": true,
                                "profile_pic_url": "https://scontent-lhr3-1.cdninstagram.com/vp/a9892b94af0e064f2e6dc4618d49ab70/5DB967FC/t51.2885-19/s150x150/26429265_1801356139896204_7973709430447407104_n.jpg?_nc_ht=scontent-lhr3-1.cdninstagram.com",
                                "username": "gordongram",
                                "blocked_by_viewer": false,
                                "followed_by_viewer": false,
                                "full_name": "Gordon Ramsay",
                                "has_blocked_viewer": false,
                                "is_private": false,
                                "is_unpublished": false,
                                "requested_by_viewer": false
                            },
                            "is_ad": false,
                            "edge_web_media_to_related_media": {
                                "edges": []
                            },
                            "encoding_status": null,
                            "is_published": true,
                            "product_type": "feed",
                            "title": "",
                            "video_duration": 56.1,
                            "thumbnail_src": "https://scontent-lhr3-1.cdninstagram.com/vp/cceb5e7655b7d5516e34d3055611de3f/5D33AC02/t51.2885-15/sh0.08/e35/s640x640/65841750_359780361311211_232905302420259283_n.jpg?_nc_ht=scontent-lhr3-1.cdninstagram.com"
                        }
                    },
                    "status": "ok"
                }
				
           ```

        4. 根据 page_info.end_cursor 获取分页数据。 
           https://www.instagram.com/graphql/query/?query_hash=f2405b236d85e8296cf30347c9f08c2a&variables=%7B%22after%22%3A%22QVFDY3p5UkRIaWVRa3Zqc3ZQMVFvWmVOM1duQzNrNnNJN282cTYtVFQzLW9FR051UnNMMHpPaUlPd0xrUFRpbG9uVkY0bXZ3emhzc3ZYMnE4Q3NqLWpuZQ%3D%3D%22%7D

           备注：variables=encodeURIComponent('{"after":"QVFDWThZYzUzbHR4Z2s1SGg1VGMtczg3ejlnd1M3TDMtcjNzcF…qVVdwOGVLazRGbGRvWXdWcDhNT25rY1FLX3lmdU9Ka2pELQ=="}')

           ```
					{

					}

           ```
    
    - 小红书

        1. 手机连接charles代理网络，在APP内搜索账号数据。charles工具自动保存https请求(https://www.xiaohongshu.com/api/sns/v10/search/notes)结果到文件。
        2. 监听文件变化，获取http接口返回数据并将数据push到Reids的channel中。 {host:"www.xiaohongshu.com",path:"/api/sns/v10/search/notes",query:""}
        3. 订阅Redis channel 获取json 数据  取出 url = obj.data.items[].note.video_info.url

        ```

        {
            "result":0,
            "success":true,
            "data":{
                "items":[
                    {
                        "model_type":"note",
                        "note":{
                            "liked":false,
                            "id":"5d1197990000000027031899",
                            "title":"关于调后视镜 你的方法用对了吗？专业版",
                            "desc":"",
                            "type":"video",
                            "user":{
                                "images":"https://img.xiaohongshu.com/avatar/5d06db6d28d32c00015d436b.jpg@80w_80h_90q_1e_1c_1x.jpg",
                                "nickname":"汽车讲堂",
                                "red_official_verified":false,
                                "red_official_verify_type":0,
                                "userid":"5d06da670000000016017701"
                            },
                            "video_info":{
                                "id":"5d1197996018f90001ebc841",
                                "height":1280,
                                "width":720,
                                "url":"http://sns-video-qc.xhscdn.com/aa7fb8cbbbfbedbb6acca1c7288201efb14f2c1b?sign=7f934f72e1c6a37ee35c6a2f57558f1f&t=5d333954",
                                "url_info_list":[
                                    {
                                        "desc":"h265-RedH265",
                                        "url":"http://sns-video-qc.xhscdn.com/aa7fb8cbbbfbedbb6acca1c7288201efb14f2c1b?sign=7f934f72e1c6a37ee35c6a2f57558f1f&t=5d333954"
                                    },
                                    {
                                        "desc":"h264-RedH264",
                                        "url":"http://sns-video-qc.xhscdn.com/e264a867cb2308fa8022b45d50b2cb8d8e941f51?sign=4d1b10a4721d835d0dfa1e2f3c728c88&t=5d333954"
                                    }
                                ],
                                "gif_url":"http://sns-img-anim-qc.xhscdn.com/FhSBO3qC2QWvw-yChDHfxacZrjzL_gif_w320?imageView2/0/format/webp",
                                "preload_size":1048576,
                                "played_count":172763
                            },
                            "recommend":{
                                "desc":"",
                                "icon":"",
                                "type":"",
                                "target_id":"",
                                "target_name":"",
                                "track_id":"notesearch_5d1197990000000027031899@dbbb6d083336480b867632e28147a2e7"
                            },
                            "image_info":{
                                "fileid":"064018a0-5e60-35c6-af64-6a5608eeb51a",
                                "height":1280,
                                "width":720,
                                "url":"http://sns-img-qc.xhscdn.com/064018a0-5e60-35c6-af64-6a5608eeb51a?imageView2/2/w/540/format/jpg",
                                "original":"http://sns-img-qc.xhscdn.com/064018a0-5e60-35c6-af64-6a5608eeb51a",
                                "index":0,
                                "url_size_large":"http://sns-img-qc.xhscdn.com/064018a0-5e60-35c6-af64-6a5608eeb51a?imageView2/2/w/1080/format/jpg"
                            },
                            "liked_count":3162,
                            "tag_info":{

                            },
                            "images_list":[
                                {
                                    "fileid":"064018a0-5e60-35c6-af64-6a5608eeb51a",
                                    "height":1280,
                                    "width":720,
                                    "url":"http://sns-img-qc.xhscdn.com/064018a0-5e60-35c6-af64-6a5608eeb51a?imageView2/2/w/540/format/jpg",
                                    "original":"http://sns-img-qc.xhscdn.com/064018a0-5e60-35c6-af64-6a5608eeb51a",
                                    "index":0,
                                    "url_size_large":"http://sns-img-qc.xhscdn.com/064018a0-5e60-35c6-af64-6a5608eeb51a?imageView2/2/w/1080/format/jpg"
                                }
                            ]
                        }
                    }
                ]
            }
        }
        ```
        4. 根据url下载视频

    - 穷游

        1. 请求接口
          https://open.qyer.com/qyer/search/index?client_id=qyer_ios&client_secret=cd254439208ab658ddf9&count=10&keyword=Arthur%E8%B5%B0%E4%B8%96%E7%95%8C&page=1&type=fugc
          备注: keyword = encodeURIComponent('keyword'),page = 1
          "type":"1" = 图片、
          "type":"2" = 语音 + 图片、
          "type":"3" = 视频

          ```
            
           {
            "status":1,
            "info":"OK",
            "times":0,
            "data":{
                "total":11,
                "tag_list":[

                ],
                "entry":[
                    {
                "id":"375819",
                "title":"悉尼美妙的清晨。每天早上跑步竟然跑出来好几条经典线路，这一条是东线植物园一带，路",
                "cover":"https://p.qyer.com/fugc/879700d8338c601c62eafb34d8c96e05?imageView2/0/h/540/format/webp",
                "model_type":"1",
                "likes":"236",
                "comments":"6",
                "collects":"24",
                "nlikes":"236",
                "ncomments":"6",
                "ncollects":"24",
                "uid":"11258306",
                "username":"Arthur走世界",
                "isoffical":"0",
                "status":"1",
                "create_time":"1555620807",
                "transcoding":"0",
                "type":"1",
                "isad":"0",
                "avator":"https://pic.qyer.com/avatar/011/25/83/06/200?v=1553845563",
                "voice_info":[

                ],
                "video_info":{

                },
                "tag_info":[
                    {
                        "id":"129612",
                        "name":"边旅行边读书",
                        "audi":"0",
                        "attach_id":"0",
                        "key":"129612",
                        "url":"",
                        "type":"0",
                        "des":null,
                        "cover":"",
                        "_x":"0",
                        "_y":"0",
                        "ptype":"0",
                        "city_id":"0",
                        "city_name":"",
                        "city_status":"0",
                        "country_id":"0",
                        "poi_id":"0",
                        "poi_name":"",
                        "poi_name_en":"",
                        "poi_lat":"",
                        "poi_lng":"",
                        "poi_cover":"",
                        "poi_beentocounts":"0",
                        "poi_country_id":"0",
                        "poi_is_hmt":0,
                        "hotel_id":"0",
                        "target_id":"0",
                        "s_jump":"0",
                        "s_jlink":""
                    }
                ],
                "togetherup_time":"0",
                "editable":1,
                "is_group":0,
                "has_exflag":"0",
                "is_fullview":"0",
                "is_together":"0",
                "is_salon":"0",
                "share_url":"https://m.qyer.com/feeds/p/3we3IgNHX3nxIL0p0iJuLQ.html",
                "timestr":"04-19",
                "source":{

                },
                "cover_width":"810",
                "cover_height":"1080",
                "cover_size":"2056657",
                "img_info":[
                        {
                            "url":"https://p.qyer.com/fugc/879700d8338c601c62eafb34d8c96e05?imageView2/2/w/1080/format/jpg",
                            "list_url":"https://p.qyer.com/fugc/879700d8338c601c62eafb34d8c96e05?imageView2/2/w/1080/format/jpg",
                            "ori_url":"https://p.qyer.com/fugc/879700d8338c601c62eafb34d8c96e05",
                            "ratio":"0",
                            "fullviewpos":"0",
                            "audi":"0",
                            "id":"879700d8338c601c62eafb34d8c96e05",
                            "has_voice":"0",
                            "has_tag":"0",
                            "size":"2056657",
                            "width":"810",
                            "height":"1080"
                        },
                        {
                            "url":"https://p.qyer.com/fugc/d93c8bdf0e670bbf26a977df39dc4dfd?imageView2/2/w/1080/format/jpg",
                            "list_url":"https://p.qyer.com/fugc/d93c8bdf0e670bbf26a977df39dc4dfd?imageView2/2/w/1080/format/jpg",
                            "ori_url":"https://p.qyer.com/fugc/d93c8bdf0e670bbf26a977df39dc4dfd",
                            "ratio":"0",
                            "fullviewpos":"0",
                            "audi":"0",
                            "id":"d93c8bdf0e670bbf26a977df39dc4dfd",
                            "has_voice":"0",
                            "has_tag":"0",
                            "size":"1499706",
                            "width":"810",
                            "height":"1080"
                        },
                        {
                            "url":"https://p.qyer.com/fugc/f355ab3b9074536b87c863b566300031?imageView2/2/w/1080/format/jpg",
                            "list_url":"https://p.qyer.com/fugc/f355ab3b9074536b87c863b566300031?imageView2/2/w/1080/format/jpg",
                            "ori_url":"https://p.qyer.com/fugc/f355ab3b9074536b87c863b566300031",
                            "ratio":"0",
                            "fullviewpos":"0",
                            "audi":"0",
                            "id":"f355ab3b9074536b87c863b566300031",
                            "has_voice":"0",
                            "has_tag":"0",
                            "size":"1885278",
                            "width":"810",
                            "height":"1080"
                        },
                        {
                            "url":"https://p.qyer.com/fugc/ff250d06dbd1c39dc9babd71fe2c9575?imageView2/2/w/1080/format/jpg",
                            "list_url":"https://p.qyer.com/fugc/ff250d06dbd1c39dc9babd71fe2c9575?imageView2/2/w/1080/format/jpg",
                            "ori_url":"https://p.qyer.com/fugc/ff250d06dbd1c39dc9babd71fe2c9575",
                            "ratio":"0",
                            "fullviewpos":"0",
                            "audi":"0",
                            "id":"ff250d06dbd1c39dc9babd71fe2c9575",
                            "has_voice":"0",
                            "has_tag":"0",
                            "size":"1904805",
                            "width":"810",
                            "height":"1080"
                        },
                        {
                            "url":"https://p.qyer.com/fugc/8d064116f02b12b6760235b25198db61?imageView2/2/w/1080/format/jpg",
                            "list_url":"https://p.qyer.com/fugc/8d064116f02b12b6760235b25198db61?imageView2/2/w/1080/format/jpg",
                            "ori_url":"https://p.qyer.com/fugc/8d064116f02b12b6760235b25198db61",
                            "ratio":"0",
                            "fullviewpos":"0",
                            "audi":"0",
                            "id":"8d064116f02b12b6760235b25198db61",
                            "has_voice":"0",
                            "has_tag":"0",
                            "size":"1277524",
                            "width":"810",
                            "height":"1080"
                        },
                        {
                            "url":"https://p.qyer.com/fugc/dbe7911eb2788cc87822cd871ab4a0c8?imageView2/2/w/1080/format/jpg",
                            "list_url":"https://p.qyer.com/fugc/dbe7911eb2788cc87822cd871ab4a0c8?imageView2/2/w/1080/format/jpg",
                            "ori_url":"https://p.qyer.com/fugc/dbe7911eb2788cc87822cd871ab4a0c8",
                            "ratio":"0",
                            "fullviewpos":"0",
                            "audi":"0",
                            "id":"dbe7911eb2788cc87822cd871ab4a0c8",
                            "has_voice":"0",
                            "has_tag":"0",
                            "size":"1641989",
                            "width":"810",
                            "height":"1080"
                        },
                        {
                            "url":"https://p.qyer.com/fugc/474b89111511bb17f4e5179e1bd3d6a2?imageView2/2/w/1080/format/jpg",
                            "list_url":"https://p.qyer.com/fugc/474b89111511bb17f4e5179e1bd3d6a2?imageView2/2/w/1080/format/jpg",
                            "ori_url":"https://p.qyer.com/fugc/474b89111511bb17f4e5179e1bd3d6a2",
                            "ratio":"0",
                            "fullviewpos":"0",
                            "audi":"0",
                            "id":"474b89111511bb17f4e5179e1bd3d6a2",
                            "has_voice":"0",
                            "has_tag":"0",
                            "size":"1930520",
                            "width":"810",
                            "height":"1080"
                        },
                        {
                            "url":"https://p.qyer.com/fugc/4bc0025149b1227211f019f2cc0a8ca7?imageView2/2/w/1080/format/jpg",
                            "list_url":"https://p.qyer.com/fugc/4bc0025149b1227211f019f2cc0a8ca7?imageView2/2/w/1080/format/jpg",
                            "ori_url":"https://p.qyer.com/fugc/4bc0025149b1227211f019f2cc0a8ca7",
                            "ratio":"0",
                            "fullviewpos":"0",
                            "audi":"0",
                            "id":"4bc0025149b1227211f019f2cc0a8ca7",
                            "has_voice":"0",
                            "has_tag":"0",
                            "size":"1532062",
                            "width":"810",
                            "height":"1080"
                        },
                        {
                            "url":"https://p.qyer.com/fugc/6a91187430ffef5e230ececedeec340b?imageView2/2/w/1080/format/jpg",
                            "list_url":"https://p.qyer.com/fugc/6a91187430ffef5e230ececedeec340b?imageView2/2/w/1080/format/jpg",
                            "ori_url":"https://p.qyer.com/fugc/6a91187430ffef5e230ececedeec340b",
                            "ratio":"0",
                            "fullviewpos":"0",
                            "audi":"0",
                            "id":"6a91187430ffef5e230ececedeec340b",
                            "has_voice":"0",
                            "has_tag":"0",
                            "size":"1913557",
                            "width":"810",
                            "height":"1080"
                        }
                    ],
                    "parentid":0
                }]
            }
           }
          ```
        
        2. 循环获取直到 obj.data.entry=[]
        
        ```

        {
            "status": 1,
            "info": "OK",
            "times": 0,
            "data": {
                "total": 0,
                "entry": [],
                "keyword": {
                    "type": "user"
                }
            }
        }

        ```




### 架构基本流程图

![markdown](https://github.com/hdgc/video-crawler/blob/master/flow.png "markdown")
