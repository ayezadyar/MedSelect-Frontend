import React from 'react'

const VideoModal = () => {
	return (
		<div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center`}>
			{/* You can customize the video embed code here */}
			<iframe
				width="560"
				height="315"
				src="https://www.youtube.com/embed/your-video-id"
				title="Embedded Video"
				frameBorder="0"
				allowFullScreen
			></iframe>

			{/* Close button */}
			<button
				className="absolute top-4 right-4 text-white cursor-pointer"
				onClick={closeVideoModal}
			>
				<FontAwesomeIcon icon={faTimesCircle} size="lg" />
			</button>
		</div>
	);
}

export default VideoModal
