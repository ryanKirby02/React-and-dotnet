using System.Linq;
using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, opt => opt
                    .MapFrom(src => src.Attendees
                        .FirstOrDefault(x => x.IsHost).User.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(dn => dn.DisplayName, opt => opt.MapFrom(src => src.User.DisplayName))
                .ForMember(un => un.Username, opt => opt.MapFrom(src => src.User.UserName))
                .ForMember(b => b.Bio, opt => opt.MapFrom(src => src.User.Bio))
                .ForMember(d => d.Image, opt => opt.MapFrom(src => src.User.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<User, Profiles.Profile>()
                .ForMember(d => d.Image, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}