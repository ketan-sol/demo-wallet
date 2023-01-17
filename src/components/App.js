import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Token from '../abis/MyToken.json';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-ethereum browser');
    }
  }

  async loadData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    console.log(accounts);
    const tokenAddress = '0xE8719a204c969003bEc80D0ceb079DB686B026EA';
    const MyToken = new web3.eth.Contract(Token.abi, tokenAddress);
    this.setState({ MyToken: MyToken });
    const balance = await MyToken.methods.balanceOf(this.state.account).call();
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Ether') });
    console.log(this.state.MyToken);
    const transactions = await MyToken.getPastEvents('Transfer', {
      fromBlock: 0,
      toBlock: 'latest',
      filter: { from: this.state.account },
    });
    this.setState({ transactions: transactions });
    console.log(transactions);
  }

  transfer(recipient, amount) {
    this.state.MyToken.methods
      .transfer(recipient, amount)
      .send({ from: this.state.account });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      MyToken: null,
      balance: 0,
      transactions: [],
    };
    this.transfer = this.transfer.bind(this);
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow"></nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div
                className="content mr-auto ml-auto"
                style={{ width: '500px' }}
              >
                <h1>{this.state.balance} MTK </h1>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const recipient = this.recipient.value;
                    const amount = window.web3.utils.toWei(
                      this.amount.value,
                      'Ether'
                    );
                    this.transfer(recipient, amount);
                  }}
                >
                  <div className="form-group mr-sm-2">
                    <input
                      id="recipient"
                      type="text"
                      ref={(input) => {
                        this.recipient = input;
                      }}
                      className="form-control"
                      placeholder="Recipient address"
                      required
                    />
                  </div>
                  <div className="form-group mr-sm-2">
                    <input
                      id="amount"
                      type="text"
                      ref={(input) => {
                        this.amount = input;
                      }}
                      className="form-control"
                      placeholder="Amount"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Send
                  </button>
                </form>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.transactions.map((tx, index) => {
                      return (
                        <tr key={index}>
                          <td>{tx.returnValues.to}</td>
                          <td>
                            {window.web3.utils.fromWei(
                              tx.returnValues.value.toString(),
                              'Ether'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
