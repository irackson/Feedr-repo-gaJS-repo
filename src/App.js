import React from 'react';

import './App.css';
import './Feed.css';
import AddSourceForm from './AddSourceForm';
import RemoveSourceForm from './RemoveSourceForm';
import Main from './Main/Main';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';

firebase.initializeApp({
	apiKey: 'AIzaSyCi_IQAU-n0P05xy2k-mQ55F80kSP5aig0',
	authDomain: 'feeder-aadf1.firebaseapp.com',
	projectId: 'feeder-aadf1',
	storageBucket: 'feeder-aadf1.appspot.com',
	messagingSenderId: '772754635747',
	appId: '1:772754635747:web:5bbedc6a3a031a46b3fed6',
	measurementId: 'G-TJXJXNDXL5',
});

const auth = firebase.auth();
const db = firebase.firestore();

function App() {
	const [user] = useAuthState(auth);

	return (
		<div className='App'>
			<header></header>

			<section>
				{user ? (
					<div>
						<Feed />
					</div>
				) : (
					<SignIn />
				)}
			</section>
		</div>
	);
}

function SignIn() {
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	};

	return (
		<button className='signIn' onClick={signInWithGoogle}>
			Sign in with Google
		</button>
	);
}

function SignOut() {
	return (
		auth.currentUser && (
			<button className='signOut' onClick={() => auth.signOut()}>
				Sign Out
			</button>
		)
	);
}

class Feed extends React.Component {
	state = {
		loading: true,
		nonSelectedSources: null,
		selectedSources: null,
		numChecked: 0,
		disabled: null,
		justSubmitted: false,
	};

	async componentDidMount() {
		const docRef = await db.collection('allsources').doc('list');
		const sourcesData = await docRef.get();
		const apis = sourcesData.data().sources;

		let difference;
		let overlap;

		const memberRef = await db.collection('members').doc(auth.currentUser.uid);
		const memberData = await memberRef.get();

		if (memberData.exists) {
			const memberSources = memberData.data().sources;
			difference = apis.filter((x) => !memberSources.includes(x));
			overlap = apis.filter((x) => memberSources.includes(x));
		} else {
			db.collection('members').doc(auth.currentUser.uid).set({
				sources: apis,
			});
			difference = [];
			overlap = apis;
		}
		if (overlap.length === 1) {
			this.setState({ disabled: true });
		} else {
			this.setState({ disabled: false });
		}

		this.setState({
			loading: false,
			nonSelectedSources: difference,
			selectedSources: overlap,
		});
		this.addSource = this.addSource.bind(this);
		this.removeSource = this.removeSource.bind(this);

		this.updateClickability = this.updateClickability.bind(this);
	}

	updateClickability = (e) => {
		this.setState({ justSubmitted: false });
		let newCount = this.state.numChecked;
		if (e.target.checked === true) {
			newCount++;
			this.setState({ numChecked: newCount });
		} else {
			newCount--;
			this.setState({ numChecked: newCount });
		}
		if (newCount > this.state.selectedSources.length - 1) {
			this.setState({ disabled: true });
		} else {
			this.setState({ disabled: false });
		}
	};

	addSource = (e) => {
		e.preventDefault();

		let theirsources = this.state.selectedSources;
		let nottheirsources = this.state.nonSelectedSources;
		for (let i = 0; i < e.target.length - 1; i++) {
			if (e.target[i].checked) {
				theirsources.push(e.target[i].value);
				nottheirsources = nottheirsources.filter(
					(s) => s !== e.target[i].value
				);
			}
		}
		db.collection('members').doc(auth.currentUser.uid).set({
			sources: theirsources,
		});
		if (this.state.numChecked === -1) {
			this.setState({ numChecked: 0 });
		} else {
			this.setState({ numChecked: -1 });
		}

		this.setState({
			nonSelectedSources: nottheirsources,
			selectedSources: theirsources,
			justSubmitted: true,
		});
	};

	removeSource = (e) => {
		e.preventDefault();

		let theirsources = this.state.selectedSources;
		let nottheirsources = this.state.nonSelectedSources;

		for (let i = 0; i < e.target.length - 1; i++) {
			if (e.target[i].checked) {
				theirsources = theirsources.filter(
					(item) => item !== e.target[i].value
				);
				nottheirsources.push(e.target[i].value);
			}
		}
		db.collection('members').doc(auth.currentUser.uid).set({
			sources: theirsources,
		});
		this.setState({
			nonSelectedSources: nottheirsources,
			selectedSources: theirsources,
			justSubmitted: true,
			numChecked: -1,
		});
	};

	render() {
		return (
			<div className='hero'>
				{this.state.loading || !this.state.nonSelectedSources ? (
					<div>loading...</div>
				) : (
					<div className='hero-container'>
						<div className='accountManagement'>
							<AddSourceForm
								className='addSourceForm'
								justSubmitted={this.state.justSubmitted}
								sources={this.state.nonSelectedSources}
								addSource={this.addSource}
							/>
							<RemoveSourceForm
								className='removeSourceForm'
								justSubmitted={this.state.justSubmitted}
								updateNumChecked={this.updateNumChecked}
								numChecked={this.state.numChecked}
								updateClickability={this.updateClickability}
								disabled={this.state.disabled}
								sources={this.state.selectedSources}
								removeSource={this.removeSource}
							/>
						</div>
						<p>Click the Feedr Logo to update preferences.</p>
						<div className='main-container'>
							<Main className='main' sources={this.state.selectedSources} />
						</div>
						<SignOut />
					</div>
				)}
			</div>
		);
	}
}

export default App;
