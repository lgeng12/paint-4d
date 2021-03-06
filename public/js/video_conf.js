const domain = 'meet.jit.si';
const options = {
    roomName: 'paint-4d-tartanhacks2021',
    width: 500,
    height: '99%',
    parentNode: document.querySelector('#video_container')
};
const api = new JitsiMeetExternalAPI(domain, options);
api.pinParticipant()