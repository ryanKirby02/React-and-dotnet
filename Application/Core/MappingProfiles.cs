using System.Linq;
using Application.Activities;
using Application.Comments;
using Application.Profiles;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : AutoMapper.Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;

            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, opt => opt
                    .MapFrom(src => src.Attendees
                        .FirstOrDefault(x => x.IsHost).User.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(dn => dn.DisplayName, opt => opt.MapFrom(src => src.User.DisplayName))
                .ForMember(un => un.Username, opt => opt.MapFrom(src => src.User.UserName))
                .ForMember(b => b.Bio, opt => opt.MapFrom(src => src.User.Bio))
                .ForMember(d => d.Image, opt => opt.MapFrom(src => src.User.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, opt => opt.MapFrom(src => src.User.Followers.Count))
                .ForMember(d => d.FollowingCount, opt => opt.MapFrom(src => src.User.Followings.Count))
                .ForMember(d => d.Following, opt => opt.MapFrom(src => src.User.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<User, Profiles.Profile>()
                .ForMember(d => d.Image, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, opt => opt.MapFrom(src => src.Followers.Count))
                .ForMember(d => d.FollowingCount, opt => opt.MapFrom(src => src.Followings.Count))
                .ForMember(d => d.Following, opt => opt.MapFrom(src => src.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentsDto>()
                .ForMember(dn => dn.DisplayName, opt => opt.MapFrom(src => src.Author.DisplayName))
                .ForMember(un => un.Username, opt => opt.MapFrom(src => src.Author.UserName))
                .ForMember(d => d.Image, opt => opt.MapFrom(src => src.Author.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<ActivityAttendee, UserActivityDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(src => src.Activity.Id))
                .ForMember(d => d.Date, opt => opt.MapFrom(src => src.Activity.Date))
                .ForMember(d => d.Title, opt => opt.MapFrom(src => src.Activity.Title))
                .ForMember(d => d.Category, opt => opt.MapFrom(src => src.Activity.Category))
                .ForMember(d => d.HostUsername, opt => opt.MapFrom(src => src.Activity.Attendees.FirstOrDefault(x => x.IsHost).User.UserName));
        }
    }
}