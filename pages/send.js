import styles from '../styles/send.module.css';

const SendItemsIn = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Send Items In</h1>

      <section className={styles.section}>
        <h2>What is this service?</h2>
        <p>
          The "Send Items In" service allows you to send your personal items to us for customisation. Whether it's a jacket, shoes, or another item – we'll transform it to your specifications.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Instructions</h2>
        <ol className={styles.steps}>
          <li>Fill out the customisation form with your request.</li>
          <li>Receive a consultation with our team.</li>
          <li>Get a confirmation and price estimate.</li>
          <li>Sign protection and liability contracts.</li>
          <li>Send your item to our studio.</li>
          <li>We begin the customisation process.</li>
          <li>Once complete, we send the customised item back to you.</li>
        </ol>
      </section>

      <section className={styles.section}>
        <h2>Processing Time</h2>
        <p>
          The entire process takes a minimum of <strong>10–14 business days</strong>, excluding weekends and holidays.
        </p>
      </section>
    </div>
  );
};

export default SendItemsIn;
