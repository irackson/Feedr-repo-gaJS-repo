function Article(props) {
	const article = props.article;
	const shouldPop = props.shouldPop;
	const articleToPop = props.articleToPop;

	// const url = article[0];
	const title = article[1];
	const tag = article[2];
	const date = article[3];
	// const text = article[4];
	const thumbnail = article[5];

	function getAge(date) {
		const articleDate = new Date(date);
		const utc = new Date();
		const duration = utc.getTime() - articleDate.getTime();

		// https://gist.github.com/Erichain/6d2c2bf16fe01edfcffa
		let day, hour, minute, seconds;
		seconds = Math.floor(duration / 1000);
		minute = Math.floor(seconds / 60);
		seconds = seconds % 60;
		hour = Math.floor(minute / 60);
		minute = minute % 60;
		day = Math.floor(hour / 24);
		hour = hour % 24;
		// https://gist.github.com/Erichain/6d2c2bf16fe01edfcffa

		if (day === 0) {
			return hour.toString() + 'h' + minute + 'm';
		} else {
			return day.toString() + 'd' + hour.toString() + 'h';
		}
	}

	if (shouldPop && articleToPop !== []) {
		return (
			<div id='popUp'>
				<a href='#' class='closePopUp' onClick={props.popDown}>
					X
				</a>
				<div class='container'>
					<h1>{props.articleToPop[1]}</h1>
					<p>{props.articleToPop[4]}</p>
					<a href={props.articleToPop[0]} class='popUpAction' target='_blank'>
						Read more from source
					</a>
				</div>
			</div>
		);
	} else {
		return (
			<article class='article'>
				<section class='featuredImage'>
					<img src={thumbnail} alt='' />
				</section>
				<section class='articleContent'>
					<a href='#' onClick={props.popUp}>
						<h3>{title}</h3>
						{/* this is the hackyest shit i've ever done... */}
						<span>
							<ol>
								<li>{article[0]}</li>
								<li>{article[1]}</li>
								<li>{article[2]}</li>
								<li>{article[3]}</li>
								<li>{article[4]}</li>
								<li>{article[5]}</li>
							</ol>
						</span>
					</a>
					<h6>{tag}</h6>
				</section>
				<section class='impressions'>
					<span>{getAge(date)}</span>
				</section>
				<div class='clearfix'></div>
			</article>
		);
	}
}

export default Article;
