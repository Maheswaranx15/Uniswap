const {
    expectEvent, // Assertions for emitted events
    time,
    expectRevert,
} = require("@openzeppelin/test-helpers");
const { use } = require("chai");
var chai = require("chai");
var expect = chai.expect;
const WBNB = artifacts.require("WBNB")
const PancakeFactory = artifacts.require("PancakeFactory")
const PancakeRouter = artifacts.require("PancakeRouter1")
const Token = artifacts.require("MyToken")
const PancakePair = artifacts.require("PancakePair")
contract("UniswapV2", (accounts) => {
    var WBNBInstance;
    var FactoryInstance;
    var RouterInstance;
    var PairInstance;
    var TokenInstance;
    var TokenInstanceB;
    let owner = accounts[0];
    let Minamount = 0;
    before(async () => {
        WBNBInstance = await WBNB.new();
        TokenInstance = await Token.new();
        TokenInstanceB = await Token.new();
        FactoryInstance = await PancakeFactory.new(owner);
        PairInstance = await PancakePair.new();
        RouterInstance = await PancakeRouter.new(FactoryInstance.address, WBNBInstance.address);
        let initialhash = await FactoryInstance.INIT_CODE_PAIR_HASH()
        let hash = '0x5f022cdf6d763a2b1989559c618ceb16b74d7eceb4f17e9bbe5a2e52bf998f91';
        expect(initialhash).equal(hash)
    })
    describe(`UniswapV2`,async()=>{
        let user1 = accounts[1];
        let user2 = accounts[2];
        let amount = web3.utils.toWei('1')
        let lpcommissionfee = 1 * 10**3
        it(`UniswapV2 TokenMint functionalities`,async()=>{
            await TokenInstance.mint(user1, amount, {from:owner, gasPrice:'0'})
        })
        it(`UniswapV2 Approve functionalities`,async()=>{
            await TokenInstance.approve(RouterInstance.address, amount, {from: user1, gasPrice:'0'})
        })
        it(`UniswapV2 TokenMint functionalities`,async()=>{
            await TokenInstanceB.mint(user1, amount, {from:owner, gasPrice:'0'})
        })
        it(`UniswapV2 Approve functionalities`,async()=>{
            await TokenInstanceB.approve(RouterInstance.address, amount, {from: user1, gasPrice:'0'})
        })
        it(`UniswapV2 AddliquidityToken functionalities`, async () => {
            Deadline = (await time.latest()).add(time.duration.days(1))
            let router = await RouterInstance.addLiquidity(TokenInstance.address, TokenInstanceB.address, amount, amount, Minamount, Minamount, user1, Deadline, { from: user1, gasPrice: '0' })
        })
        it(`UniswapV2 Getpair Functionalities`, async () => {
            var pairid = 0;
            const PairInstanceAddress = await FactoryInstance.getPair(
                TokenInstance.address,
                TokenInstanceB.address,
            );
            PairInstance = await PancakePair.at(
                PairInstanceAddress,
            );
            expect(await FactoryInstance.allPairs(pairid)).equal(PairInstanceAddress)
        })
        it("should add liqudity", async () => {
            const value = await PairInstance.getReserves();
            expect(Number(value[0])).equal(Number(amount));
            expect(Number(value[1])).equal(Number(amount));
            // console.log(`value`,Number(value[0]));
            // console.log(`value`,Number(value[1]));
        });
        it(`Liquiditypool_balance`,async()=>{
            let Lpbalance = Math.sqrt(amount*amount)
            Lpbalance = (Number(Lpbalance) - Number(lpcommissionfee) )
            expect(Lpbalance).equal(Number(await PairInstance.balanceOf(user1)))
            // console.log(`lp`,(Number ( await PairInstance.balanceOf(user1))));
            // console.log(Lpbalance);
        })
        it(`UniswapV2 SwapExactTokenForTokens Functionality`, async () => {
            let lpaddress = await FactoryInstance.allPairs(0)
            console.log(lpaddress);
            var tokenAmount = web3.utils.toWei('1')
            let Tokenswapuser = accounts[1]
            await TokenInstance.mint(Tokenswapuser, tokenAmount, { from: owner, gasPrice: '0' })
            await TokenInstance.approve(RouterInstance.address, tokenAmount, { from: Tokenswapuser, gasPrice: '0' })
            const [
                ,
                amountOutMin,
            ] = await RouterInstance.getAmountsOut(tokenAmount, [
                TokenInstance.address,
                TokenInstanceB.address,
            ]);
            console.log(`amountOutMin`,Number(amountOutMin));
            Tokenbalancebefore = await TokenInstanceB.balanceOf(Tokenswapuser)
            Tokenbalancebefore = (Number(Tokenbalancebefore) + Number(amountOutMin))
            Deadline = (await time.latest()).add(time.duration.days(1))
            await RouterInstance.swapExactTokensForTokens(tokenAmount, amountOutMin, [TokenInstance.address, TokenInstanceB.address], Tokenswapuser, Deadline, { from: Tokenswapuser, gasPrice: '0' })
            Tokenbalanceafter = await TokenInstanceB.balanceOf(Tokenswapuser)

        })
    })
    describe(`UniswapV2-addLiquidity,SwapExactETHforToken Functionality`, async () => {
        var liqudityuser = accounts[2];
        var Tokenswapuser = accounts[3];
        var lpcommissionfee = 1024;
        var tokenLiquidityAmount = web3.utils.toWei("5");
        var Ethliqudityamount = web3.utils.toWei("5");
        it(`UniswapV2 Createpair Functionalities`, async () => {
            await FactoryInstance.createPair(
                TokenInstance.address,
                WBNBInstance.address,
                { from: liqudityuser },
            );
          
        })
        it(`UniswapV2 Mint and Approve Functionalities`, async () => {
            await TokenInstance.mint(liqudityuser, tokenLiquidityAmount, { from: owner, gasPrice: '0' })
            await TokenInstance.approve(RouterInstance.address, tokenLiquidityAmount, { from: liqudityuser, gasPrice: '0' })
        })
        it(`UniswapV2 AddliquidityETH functionalities`, async () => {
            Deadline = (await time.latest()).add(time.duration.days(1))
            await RouterInstance.addLiquidityETH(TokenInstance.address, tokenLiquidityAmount, tokenLiquidityAmount, Ethliqudityamount, liqudityuser, Deadline, { from: liqudityuser, value: Ethliqudityamount, gasPrice: '0' })
        })
        it(`UniswapV2 Getpair Functionalities`, async () => {
            var pairid = 1
            const PairInstanceAddress = await FactoryInstance.getPair(
                TokenInstance.address,
                WBNBInstance.address,
            );
            PairInstance = await PancakePair.at(
                PairInstanceAddress,
            );
            expect(await FactoryInstance.allPairs(pairid)).equal(PairInstanceAddress)
        })
        it("should add liqudity", async () => {
            const value = await PairInstance.getReserves();
            expect(Number(value[0])).equal(Number(tokenLiquidityAmount));
            expect(Number(value[1])).equal(Number(Ethliqudityamount));
        })
        it(`Liquiditypool_balance`,async()=>{
            let Lpbalance = Math.sqrt(tokenLiquidityAmount*tokenLiquidityAmount)
            Lpbalance = (Number(Lpbalance) - Number(lpcommissionfee) )
            expect(Lpbalance).equal(Number( await PairInstance.balanceOf(liqudityuser)))
        })
        it(`UniswapV2 Mint and Approve Functionality`, async () => {
            await TokenInstance.mint(Tokenswapuser, tokenLiquidityAmount, { from: owner, gasPrice: '0' })
            await TokenInstance.approve(RouterInstance.address, tokenLiquidityAmount, { from: Tokenswapuser, gasPrice: '0' })
        })
        it(`UniswapV2 SwapExactTokensForETH Functionality`,async()=>{
            const [
                ,
                amountOutMin,
            ] = await RouterInstance.getAmountsOut(tokenLiquidityAmount, [
                TokenInstance.address,
                WBNBInstance.address,
            ]);
            Deadline = (await time.latest()).add(time.duration.days(1))
            await RouterInstance.swapExactTokensForETH(
                tokenLiquidityAmount,
                amountOutMin,
                [TokenInstance.address, WBNBInstance.address],
                Tokenswapuser,
                Deadline,
                {
                    from: Tokenswapuser,
                },
            );
        })
    })
})
    